

const validate = (schema, property = "body") => { // Middleware function to validate request data
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      const errors = error.details.map((detail) => detail.message); // Extract error messages
      return res.status(400).json({ errors });
    }
    next();
  };
};
//
export default validate