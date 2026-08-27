import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentUploadToken, verifyToken } from '@/lib/auth';
import { config } from '@/lib/config';
import prisma from '@/lib/prisma';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function POST(req: NextRequest) {
  try {
    const { orderId, uploadToken } = await req.json();
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const authToken = req.cookies.get('token')?.value;
    const decoded = authToken ? verifyToken(authToken) : null;
    const tokenOrder = typeof uploadToken === 'string' ? verifyPaymentUploadToken(uploadToken) : null;
    if (!decoded && tokenOrder?.orderId !== orderId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (decoded && order.userId !== decoded.id && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!order.paymentProofUrl) {
      return NextResponse.json({ error: 'Upload your payment photo first' }, { status: 400 });
    }
    if (!config.telegramBotToken) {
      return NextResponse.json({ error: 'Telegram bot is not configured' }, { status: 503 });
    }

    const chatIds = [...new Set([config.telegramAdminChatId, config.telegramGroupChatId].filter(Boolean))];
    if (chatIds.length === 0) {
      return NextResponse.json({ error: 'Telegram admin or group chat is not configured' }, { status: 503 });
    }

    const filename = path.basename(order.paymentProofUrl);
    const filepath = path.join(process.cwd(), 'public', 'uploads', 'payments', filename);
    const photo = await fs.readFile(filepath);
    const caption = `Payment proof for ${order.orderCode}\nCustomer: ${order.customerName}\nProduct: ${order.productName}\nAmount: ${order.price} USD\nPayment: ${order.paymentMethod || 'KHQR'}`;
    const results = await Promise.all(chatIds.map(async (chatId) => {
      const form = new FormData();
      form.append('chat_id', chatId);
      form.append('caption', caption);
      form.append('photo', new Blob([photo]), filename);
      const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendPhoto`, {
        method: 'POST',
        body: form,
      });
      const data = await response.json() as { ok?: boolean; description?: string };
      return { chatId, ok: response.ok && data.ok === true, error: data.description };
    }));

    const sent = results.filter((result) => result.ok).length;
    if (sent === 0) {
      return NextResponse.json({ error: results[0]?.error || 'Telegram could not receive the photo' }, { status: 502 });
    }

    return NextResponse.json({ sent, total: chatIds.length, partial: sent < chatIds.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send payment photo to Telegram' }, { status: 500 });
  }
}