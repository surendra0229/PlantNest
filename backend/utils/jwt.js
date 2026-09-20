const jwt = require('jsonwebtoken');

const USER_COOKIE = 'plantnest_user_token';
const ADMIN_COOKIE = 'plantnest_admin_token';

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER || (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('localhost'));
  return {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  };
};

const getClearCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER || (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('localhost'));
  return {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction ? true : false,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  };
};

const setUserTokenCookie = (res, userId) => {
  const secret = process.env.JWT_USER_SECRET;
  if (!secret) {
    throw new Error('JWT_USER_SECRET is missing in process.env');
  }
  const token = jwt.sign({ id: userId, role: 'user' }, secret, {
    expiresIn: '7d',
  });

  res.cookie(USER_COOKIE, token, getCookieOptions());
  return token;
};

const sendUserToken = (res, userId, statusCode = 200, extraData = {}) => {
  const token = setUserTokenCookie(res, userId);

  return res.status(statusCode).json({
    success: true,
    token,
    ...extraData
  });
};

const sendAdminToken = (res, adminId, statusCode = 200, extraData = {}) => {
  const secret = process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_ADMIN_SECRET is missing in process.env');
  }
  const token = jwt.sign({ id: adminId, role: 'admin' }, secret, {
    expiresIn: '7d',
  });

  res.cookie(ADMIN_COOKIE, token, getCookieOptions());

  return res.status(statusCode).json({
    success: true,
    token,
    ...extraData
  });
};

const clearUserToken = (res) => {
  res.cookie(USER_COOKIE, '', getClearCookieOptions());
};

const clearAdminToken = (res) => {
  res.cookie(ADMIN_COOKIE, '', getClearCookieOptions());
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
