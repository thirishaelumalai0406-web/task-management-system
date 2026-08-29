const { validationResult } = require('express-validator');

// Runs express-validator checks; returns formatted errors if any exist.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((error) => ({
      field: error.path,
      message: error.msg
    }));
    return res.status(400).json({ success: false, errors: formatted });
  }
  next();
};

module.exports = validate;
