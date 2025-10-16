import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const protectedRoute = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable for secret
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};