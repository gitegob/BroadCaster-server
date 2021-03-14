import { serverError as serverErr } from '../helpers/helpers';

// eslint-disable-next-line no-unused-vars
const serverError = (req, _res) => {
  const { status } = req.body;
  serverErr(status, 'Internal server error');
};
export default serverError;
