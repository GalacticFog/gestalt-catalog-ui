const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /ace/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  // Ensures we are processing only json files
  if (node.internal.type !== 'CatalogCompiledJson') {
    return;
  }

  const slug = createFilePath({ node, getNode, basePath: `pages` });
  createNodeField({
    node,
    name: `slug`,
    value: slug,
  });
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allCatalogCompiledJson {
          edges {
            node {
              fields {
                slug
              }
              Chart {
                name
              }
            }
          }
        }
      }
    `).then(result => {
        result.data.allCatalogCompiledJson.edges.forEach(({ node }) => {
          const slug = path.join(node.Chart.name);

          createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/pages/details.js`),
            context: {
              // Data passed to context is available
              // in page queries as GraphQL variables.
              slug: node.fields.slug,
            },
          });
        })
        resolve();
      });
  });
}
