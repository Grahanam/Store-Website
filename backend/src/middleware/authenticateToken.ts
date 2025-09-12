import { Request, Response,NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';




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

    (req as any).user = decoded;
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};