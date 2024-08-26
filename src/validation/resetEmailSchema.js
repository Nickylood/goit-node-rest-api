import Joi from 'joi';

export const requestResetEmailSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
