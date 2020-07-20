import Joi from '@hapi/joi';

const schema = {
  signupSchema: Joi.object({
    firstName: Joi.string()
      .min(2)
      .trim()
      .regex(/^[\sA-Za-z]{1,}$/)
      .required(),
    lastName: Joi.string()
      .min(2)
      .trim()
      .regex(/^[\sA-Za-z]{1,}$/)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,128}$/)
      .required(),
  }),
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  recordSchema: Joi.object({
    title: Joi.string().min(5).max(50).trim()
      .required(),
    type: Joi.valid('red-flag', 'intervention').required(),
    description: Joi.string().min(20).trim().required(),
    district: Joi.string().min(3).max(30).trim()
      .required(),
    sector: Joi.string().min(3).max(30).trim()
      .required(),
    cell: Joi.string().min(3).max(50).trim()
      .required(),
  }),
  statusSchema: Joi.object({
    status: Joi.valid('pending', 'under investigation', 'resolved', 'rejected').required(),
  }),
};

export default schema;
