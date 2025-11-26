import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from '../utils/jwt';


export function requireAuth(req: Request, res: Response, next: NextFunction) {
const token = req.cookies['access_token'];
if (!token) return res.status(401).json({ message: 'Unauthenticated' });
const payload = verifyAccessToken(token);
if (!payload) return res.status(401).json({ message: 'Invalid token' });
(req as any).user = payload;
next();
}


export function requireRole(role: 'agent' | 'client') {
return (req: Request, res: Response, next: NextFunction) => {
const user = (req as any).user;
if (!user || user.role !== role) return res.status(403).json({ message: 'Forbidden' });
next();
};
}