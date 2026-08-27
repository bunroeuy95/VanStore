import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getAuthTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value || getAuthTokenFromRequest(req as unknown as Request);
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
  });
}
