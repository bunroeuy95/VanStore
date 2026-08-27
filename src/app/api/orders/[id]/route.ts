import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { status, paymentProofUrl } = body;

    // Only admin can change status, but user can upload payment proof
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (decoded.role !== 'ADMIN' && existing.userId !== decoded.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let updateData: any = {};
    if (status) {
      if (decoded.role !== 'ADMIN' && !['Pending Verification'].includes(status)) {
        return NextResponse.json({ error: 'Only admin can change status' }, { status: 403 });
      }
      updateData.status = status;
    }
    if (paymentProofUrl) {
      updateData.paymentProofUrl = paymentProofUrl;
      if (decoded.role !== 'ADMIN') {
        updateData.status = 'Pending Verification';
      }
    }

    const order = await prisma.order.update({ where: { id }, data: updateData });
    return NextResponse.json({ order });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { product: true } });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ order });
}
