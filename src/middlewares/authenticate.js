// import jwt from 'jsonwebtoken';
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

    // const isAccessTokenExpired =
    //   new Date() > new Date(session.accessTokenValidUntil);

    // if (isAccessTokenExpired) {
    //   next(createHttpError(401, 'Access token expired'));
    // }

    const user = await UsersCollection.findById(session.userId);

    if (!user) {
      return next(createHttpError(401));
    }

    // const sessionId =req.cookies.sessionId;
    // const refreshToken = req.cookies.refreshToken;
    // if (!session || !refreshToken) {
    //   return next(createHttpError(401, 'Session or refresh token missing'));
    // }

    req.user = user;
    // req.sessionId = sessionId;
    // req.refreshToken = refreshToken;
    next();
  } catch (error) {
    next(error);
  }
};
