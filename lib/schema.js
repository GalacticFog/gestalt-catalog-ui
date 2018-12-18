const { string, object, array } = require('yup');

const schema = object().shape({
  file: string().required(),
  type: string().required(),
  meta: object().shape({
    name: string().required().default('not specified'),
    version: string().required().default('not specified'),
    description: string().required(),
    home: string().required(),
    icon: string().required(),
  }).required(),
  readme: string().required().default(''),
  requirements: object().shape({
    dependencies: array().of(
      object().shape({
        name: string(),
      }).required()
    ).default([{ name: 'none' }]),
  }).required().default({}),
  payload: string().required().default(''),
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
