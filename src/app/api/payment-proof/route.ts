import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, verifyPaymentUploadToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import fs from 'node:fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const authToken = req.cookies.get('token')?.value;
    const decoded = authToken ? verifyToken(authToken) : null;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const orderId = formData.get('orderId') as string | null;
    const uploadToken = formData.get('uploadToken') as string | null;

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    if (!orderId) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    if (!decoded && (!uploadToken || verifyPaymentUploadToken(uploadToken)?.orderId !== orderId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (decoded && order.userId !== decoded.id && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'payments');
    await fs.mkdir(uploadsDir, { recursive: true });

    const extensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };
    const ext = extensions[file.type] || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, buffer);

    const url = `/uploads/payments/${filename}`;
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentProofUrl: url, status: 'Pending Verification' },
      });
    } catch (error) {
      await fs.unlink(filepath).catch(() => undefined);
      throw error;
    }

    return NextResponse.json({
      url,
      orderId,
      telegramSent: false,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
