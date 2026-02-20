const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, coerceTypes: true, removeAdditional: true });
addFormats(ajv);

function compileSchema(schema) {
  return ajv.compile(schema);
}

function validate(schema) {
  const validateFn = typeof schema === 'function' ? schema() : compileSchema(schema);

  return (req, res, next) => {
    const data = req.body || {};
    const valid = validateFn(data);
    if (!valid) {
      const errors = validateFn.errors.map(e => ({ path: e.instancePath || e.schemaPath, message: e.message }));
      return res.status(400).json({ error: { message: 'Validation failed', details: errors } });
    }
    next();
  };
}

module.exports = { validate, compileSchema };
