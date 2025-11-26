import type { Request, Response } from 'express';
import { User } from '../users/user.model.js';
import { hashPassword, verifyPassword } from '../../utils/passwords.js';
import { signTokens, verifyRefreshToken } from '../../utils/jwt.js';

// --- FIX: Define Secure Cookie Options ---
// These settings allow cookies to travel between your frontend and backend on Render.
const cookieOptions = {
  httpOnly: true,
  secure: true,             // Required for HTTPS (Render)
  sameSite: 'none' as const,// Required for cross-site requests (Frontend -> Backend)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, passwordHash, role });

    const tokens = signTokens({ sub: user._id.toString(), role: user.role });
    
    // FIX: Set cookies using the secure options
    res.cookie('access_token', tokens.accessToken, cookieOptions);
    res.cookie('refresh_token', tokens.refreshToken, cookieOptions);

    return res.status(201).json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const tokens = signTokens({ sub: user._id.toString(), role: user.role });
    
    // FIX: Set cookies using the secure options
    res.cookie('access_token', tokens.accessToken, cookieOptions);
    res.cookie('refresh_token', tokens.refreshToken, cookieOptions);

    return res.json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = async (_: Request, res: Response) => {
  // FIX: Clear cookies using the same options to ensure they are removed
  res.clearCookie('access_token', cookieOptions);
  res.clearCookie('refresh_token', cookieOptions);
  res.json({ message: 'Logged out' });
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies['refresh_token'];
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const payload = verifyRefreshToken(token);
    if (!payload) return res.status(401).json({ message: 'Invalid refresh token' });

    const tokens = signTokens(payload);
    
    // FIX: Set new cookies using the secure options
    res.cookie('access_token', tokens.accessToken, cookieOptions);
    res.cookie('refresh_token', tokens.refreshToken, cookieOptions);
    
    res.json({ message: 'Token refreshed' });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: 'Unauthenticated' });

  const found = await User.findById(user.sub).select('-passwordHash');
  res.json({ user: found });
};