import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const protectedRoute = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
        const token = req.cookies?.jwt;
        console.log("Token from cookies:", token);
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, secret) as { userId: string };
        req.user = { id: decoded.userId, email: '', role: '' }; // Email and role can be fetched from DB if needed

        next(); 
    } catch (error) {
        console.log('Error in protectRoute middleware: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default protectedRoute;