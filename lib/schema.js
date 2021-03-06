const { string, object, array, boolean } = require('yup');

const schema = object().shape({
  file: string().required(), // internally set by compiler
  type: string().required(), // internally set by compiler
  meta: object().shape({
    name: string().required().default('not specified'),
    version: string().required().default('not specified'),
    description: string(),
    home: string().default(''),
    icon: string().default(''),
  }).required(),
  readme: string().default(''),
  requirements: object().shape({
    dependencies: array().of(
      object().shape({
        name: string(),
      }).required()
    ).default([{ name: 'This catalog item has no other dependencies' }]),
  }).required().default({}),
  deploy: object().shape({
    enabled: boolean().default(false),
    type: string().oneOf(['generic', 'custom']).default('generic'),
    url: string().default(''),
    method: string().oneOf(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).default('POST'),
    headers: string().default("{ \"Content-Type\": \"application/json\" }"),
  }),
  payload: object().shape({
    type: string().oneOf(['json', 'yaml']).default('yaml'),
    render: string().oneOf(['code', 'swagger', 'none']).default('none'),
    data: string().default(''),
  })
});

function castSchema(model) {
  try {
    return schema.validateSync(schema.cast(model));
  } catch (e) {
    throw 'invalid schema';
  }
}

module.exports = {
  castSchema,
}
