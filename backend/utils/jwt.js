const jwt = require('jsonwebtoken');

const USER_COOKIE = 'plantnest_user_token';
const ADMIN_COOKIE = 'plantnest_admin_token';

const setUserTokenCookie = (res, userId) => {
  const secret = process.env.JWT_USER_SECRET;
  if (!secret) {
    throw new Error('JWT_USER_SECRET is missing in process.env');
  }
  const token = jwt.sign({ id: userId, role: 'user' }, secret, {
    expiresIn: '7d',
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  };

  res.cookie(USER_COOKIE, token, cookieOptions);
  return token;
};

const sendUserToken = (res, userId, statusCode = 200, extraData = {}) => {
  setUserTokenCookie(res, userId);

  return res.status(statusCode).json({
    success: true,
    ...extraData
  });
};

const sendAdminToken = (res, adminId, statusCode = 200, extraData = {}) => {
  const secret = process.env.JWT_ADMIN_SECRET;
  if (!secret) {
    throw new Error('JWT_ADMIN_SECRET is missing in process.env');
  }
  const token = jwt.sign({ id: adminId, role: 'admin' }, secret, {
    expiresIn: '7d',
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  };

  res.cookie(ADMIN_COOKIE, token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    ...extraData
  });
};

const clearUserToken = (res) => {
  res.cookie(USER_COOKIE, '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax',
    path: '/'
  });
};

const clearAdminToken = (res) => {
  res.cookie(ADMIN_COOKIE, '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax',
    path: '/'
  });
};

module.exports = {
  USER_COOKIE,
  ADMIN_COOKIE,
  setUserTokenCookie,
  sendUserToken,
  sendAdminToken,
  clearUserToken,
  clearAdminToken
};
