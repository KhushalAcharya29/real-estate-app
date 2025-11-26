import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { ENV } from '../config/env.js';


export interface JwtPayload {
sub: string; // user id
role: 'agent' | 'client';
}


export function signTokens(payload: JwtPayload) {
const accessToken = jwt.sign(payload, ENV.JWT_ACCESS_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn: '7d' });
return { accessToken, refreshToken };
}


export function verifyAccessToken(token: string) {
try {
return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as JwtPayload;
} catch {
return null;
}
}


export function verifyRefreshToken(token: string) {
try {
return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as JwtPayload;
} catch {
return null;
}
}


export function setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
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


export function clearAuthCookies(res: Response) {
res.clearCookie('access_token');
res.clearCookie('refresh_token');
}