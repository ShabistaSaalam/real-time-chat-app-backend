import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },           // Payload
    JWT_SECRET,               // Secret
    { expiresIn: '4d' }       // Options
  );
};

export default generateToken