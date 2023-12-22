import jwt from 'jsonwebtoken';

// Authentication using JWT
export function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    // If no token found, return an error response
    if (!token) {
      return res.status(401).json({ error: 'Access token not found' });
    }
  
    try {
      // If the token is valid, extract the user_id from the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user_id = decoded.user_id;
      next();
    } catch (err) {
      // If token is invalid, return an error response
      return res.status(403).json({ error: 'Invalid access token' });
    }
  }