import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: decoded.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ wishlist });
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: decoded.id, productId } },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ message: 'Removed from favorites 💔' });
    }

    await prisma.wishlist.create({ data: { userId: decoded.id, productId } });
    return NextResponse.json({ message: 'Added to your favorites ❤️' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

  await prisma.wishlist.deleteMany({ where: { userId: decoded.id, productId } });
  return NextResponse.json({ success: true });
}
