import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, generateOrderCode, generatePaymentUploadToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';

  let where: any = {};
  if (!all || decoded.role !== 'ADMIN') {
    where.userId = decoded.id;
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { product: true, user: true },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, customerName, customerContact, paymentMethod } = body;

    if (!productId || !customerName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (product.stock <= 0) return NextResponse.json({ error: 'Out of stock' }, { status: 400 });

    const token = req.cookies.get('token')?.value;
    let userId: string | null = null;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) userId = decoded.id;
    }

    const orderCode = generateOrderCode();

    const order = await prisma.order.create({
      data: {
        orderCode,
        userId,
        productId: product.id,
        productName: product.name,
        price: product.price,
        productImage: product.imageUrl,
        customerName,
        customerContact,
        paymentMethod: paymentMethod || 'KHQR',
        status: 'Pending',
      },
    });

    // Decrement stock? Let's not auto decrement until paid, but reduce for demo
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: { decrement: 1 } },
    });

    return NextResponse.json({
      order: {
        ...order,
        uploadToken: generatePaymentUploadToken(order.id),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
