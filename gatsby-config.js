const path = require('path');

const {
  title,
  description,
  catalogCompiledDirectory
} = require('./config');

module.exports = {
  siteMetadata: {
    title,
    description,
  },
  plugins: [
    'gatsby-plugin-styled-components',
    'gatsby-plugin-typography',
      {
        resolve: `@wapps/gatsby-plugin-material-ui`,
        options: {
        // Add any options here
      },
    },
    `gatsby-transformer-json`, 
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: path.join(__dirname, catalogCompiledDirectory),
      },
    },
  ],
}