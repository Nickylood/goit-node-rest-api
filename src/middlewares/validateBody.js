import createHttpError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    next(createHttpError(400, error.details[0].message));
  } else {
    next();
  }
};
