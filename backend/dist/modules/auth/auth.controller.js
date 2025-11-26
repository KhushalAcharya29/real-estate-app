import { User } from '../users/user.model';
import { hashPassword, verifyPassword } from '../../utils/passwords';
import { signTokens, setAuthCookies, clearAuthCookies, verifyRefreshToken } from '../../utils/jwt';
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
        return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, passwordHash, role });
    // CHANGE HERE: user.id -> user._id
    const tokens = signTokens({ sub: user._id.toString(), role: user.role });
    setAuthCookies(res, tokens);
    // CHANGE HERE: user.id -> user._id
    return res.status(201).json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid)
        return res.status(401).json({ message: 'Invalid credentials' });
    // CHANGE HERE: user.id -> user._id
    const tokens = signTokens({ sub: user._id.toString(), role: user.role });
    setAuthCookies(res, tokens);
    // CHANGE HERE: user.id -> user._id
    return res.json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
};
export const logout = async (_, res) => {
    clearAuthCookies(res);
    res.json({ message: 'Logged out' });
};
export const refresh = async (req, res) => {
    const token = req.cookies['refresh_token'];
    if (!token)
        return res.status(401).json({ message: 'No refresh token' });
    const payload = verifyRefreshToken(token);
    if (!payload)
        return res.status(401).json({ message: 'Invalid refresh token' });
    const tokens = signTokens(payload);
    setAuthCookies(res, tokens);
    res.json({ message: 'Token refreshed' });
};
export const getMe = async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ message: 'Unauthenticated' });
    const found = await User.findById(user.sub).select('-passwordHash');
    res.json({ user: found });
};
