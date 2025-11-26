import { Router } from 'express';
import { register, login, refresh, getMe } from './auth.controller';
import { requireAuth } from '../../middleware/auth';
const router = Router();
console.log('✅ Auth routes loaded');
router.post('/register', register);
router.post('/login', login);
router.post("/logout", (req, res) => {
    res
        .clearCookie("access_token")
        .clearCookie("refresh_token")
        .status(200)
        .json({ message: "Logged out successfully" });
});
router.post('/refresh', refresh);
router.get('/me', requireAuth, getMe);
export default router;
