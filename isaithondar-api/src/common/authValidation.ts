import Boom from '@hapi/boom';
import localAuth from './localAuth';
import logger from './logger';
import { Request } from '@hapi/hapi';
import { ERRORMESSAGE } from './constants/ErrorCodeConstant';

const unauthorized = () => Boom.unauthorized(ERRORMESSAGE.INVALID_TOKEN);

const verifyToken = (token: string) => {
  try {
    const user = localAuth.verifyUser(token);
    return { isValid: true, credentials: { token }, artifacts: { user } };
  } catch (err: any) {
    logger.error(`Token validation failed: ${err.message}`);
    return { isValid: false, artifacts: null };
  }
};

const validate = (token: string) => {
  const result = verifyToken(token);
  return result.isValid ? result : unauthorized();
};

const tokenValidator = {
  validate: (req: Request, token: string) => validate(token),
  unauthorized,
};

export default tokenValidator;
