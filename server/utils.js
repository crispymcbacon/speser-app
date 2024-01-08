import jwt from 'jsonwebtoken';

// Authentication using JWT
export async function authenticateToken(req, res, next) {
  const authHeader = await req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get the jwt access token from the request header

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
    return res.status(403).json({ error: 'Invalid access token' });
  }
}