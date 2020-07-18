export const sendSuccess = (res, status, message, data) => res.status(status).send({
  status,
  message,
  data,
});

export const sendError = (res, status, error) => res.status(status).send({
  status,
  error,
});
