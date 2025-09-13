import { Request, Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = (roles:string[])=>(req: Request, res: Response, next: NextFunction) => {

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if(!roles.includes(decoded.role)){
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = {
      id:decoded.sub,
      role:decoded.role
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};