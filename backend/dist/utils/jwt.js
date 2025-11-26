import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
export function signTokens(payload) {
    const accessToken = jwt.sign(payload, ENV.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}
export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, ENV.JWT_ACCESS_SECRET);
    }
    catch {
        return null;
    }
}
export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
    }
    catch {
        return null;
    }
}
export function setAuthCookies(res, tokens) {
    res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // set to true in production (HTTPS)
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}
export function clearAuthCookies(res) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
}
