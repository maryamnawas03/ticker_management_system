// Verifies that required fields are present and non-empty in the request body.

const validateBody = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter(
      (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === ''
    );

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
        statusCode: 400,
      });
    }

    next();
  };
};

export default validateBody;
