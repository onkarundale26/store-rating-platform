import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'store-rating-jwt-secret-key-2024';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
