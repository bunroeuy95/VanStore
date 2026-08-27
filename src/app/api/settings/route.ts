import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        storeName: process.env.STORE_NAME || 'VAN STORE',
        telegramUsername: process.env.TELEGRAM_ADMIN_USERNAME || 'vanstorev',
        tiktokUsername: process.env.TIKTOK_USERNAME || 'van_magic3',
        facebookUrl: process.env.FACEBOOK_PAGE_URL || 'https://facebook.com',
      },
    });
  }
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const existing = await prisma.siteSettings.findFirst();
    let settings;
    if (existing) {
      settings = await prisma.siteSettings.update({ where: { id: existing.id }, data: body });
    } else {
      settings = await prisma.siteSettings.create({ data: body });
    }
    return NextResponse.json({ settings });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
