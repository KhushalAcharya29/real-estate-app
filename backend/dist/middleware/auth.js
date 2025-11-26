import { verifyAccessToken } from '../utils/jwt';
export function requireAuth(req, res, next) {
    const token = req.cookies['access_token'];
    if (!token)
        return res.status(401).json({ message: 'Unauthenticated' });
    const payload = verifyAccessToken(token);
    if (!payload)
        return res.status(401).json({ message: 'Invalid token' });
    req.user = payload;
    next();
}
export function requireRole(role) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || user.role !== role)
            return res.status(403).json({ message: 'Forbidden' });
        next();
    };
}
