import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort'); // price_asc, price_desc, newest
  const featured = searchParams.get('featured');

  let where: any = {};
  if (category && category !== 'ALL') where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (featured === 'true') where.featured = true;

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  // SQLite doesn't support mode insensitive, so we need fallback
  try {
    const products = await prisma.product.findMany({ where, orderBy });
    return NextResponse.json({ products });
  } catch {
    // Fallback for sqlite: manual filter
    const all = await prisma.product.findMany({ orderBy });
    let filtered = all;
    if (category && category !== 'ALL') filtered = filtered.filter((p: any) => p.category === category);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((p: any) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    if (featured === 'true') filtered = filtered.filter((p: any) => p.featured);
    if (sort === 'price_asc') filtered = filtered.sort((a: any, b: any) => a.price - b.price);
    if (sort === 'price_desc') filtered = filtered.sort((a: any, b: any) => b.price - a.price);
    return NextResponse.json({ products: filtered });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { name, category, description, price, imageUrl, stock, featured } = body;

    if (!name || !category || !description || price === undefined) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        description,
        price: parseFloat(price),
        imageUrl,
        stock: parseInt(stock) || 0,
        featured: !!featured,
      },
    });

    return NextResponse.json({ product });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
