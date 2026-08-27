import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: { id: string; username: string; role: string; email: string }): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    return null;
  }
}

export function generatePaymentUploadToken(orderId: string): string {
  return jwt.sign({ orderId, purpose: 'payment-upload' }, config.jwtSecret, { expiresIn: '15m' });
}

export function verifyPaymentUploadToken(token: string): { orderId: string } | null {
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (
      typeof payload !== 'object' ||
      payload === null ||
      payload.purpose !== 'payment-upload' ||
      typeof payload.orderId !== 'string'
    ) {
      return null;
    }
    return { orderId: payload.orderId };
  } catch {
    return null;
  }
}

export function generateOrderCode(): string {
  const prefix = Math.random() > 0.5 ? 'MC' : 'KB';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `#${prefix}${num}${Date.now().toString().slice(-3)}`;
}

export function getAuthTokenFromRequest(req: Request): string | null {
  const cookie = req.headers.get('cookie');
  if (!cookie) return null;
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}
