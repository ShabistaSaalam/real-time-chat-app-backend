import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET
export const protectRoute = async (req, res, next) => {
  let token;
    try {
      // Get token from header

      token = req.headers.token;

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token and attach to request object (excluding password)
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.json({success:false,message:"User not found"})
      
      req.user=user
      next(); // Continue to protected route

    } catch (error) {
      console.error('JWT error:', error.message);
    
  }
};

