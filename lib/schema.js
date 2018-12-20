const { string, object, array, boolean } = require('yup');

const schema = object().shape({
  file: string().required(),
  type: string().required(),
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
    ).default([{ name: 'none' }]),
  }).required().default({}),
  deployable: boolean().default(false),
  payload: object().shape({
    type: string().oneOf(['json', 'yaml']).default('yaml'),
    render: string().oneOf(['code', 'swagger']).default('code'),
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
