
import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import UsersCollection from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(createHttpError(401, 'Please provide Authorization header'));
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return next(createHttpError(401, 'Auth header should be of type Bearer'));
    }

    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    if (Date.now() > session.accessTokenValidUntil) {
      return next(createHttpError(401, 'Session token is expired!'));
    }

    const user = await UsersCollection.findById(session.userId);

    if (!user) {
      return next(createHttpError(401));
    }

    req.user = user;
  
    next();
  } catch (error) {
    next(error);
  }
};
