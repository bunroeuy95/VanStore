import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: 'ADMIN_EMAIL and ADMIN_PASSWORD must be configured' }, { status: 500 });
    }

    const adminName = process.env.ADMIN_NAME || 'Admin';
    const adminUsername = process.env.ADMIN_USERNAME || adminEmail.split('@')[0];
    const passwordHash = await hashPassword(adminPassword);
    const admin = await prisma.user.findUnique({ where: { email: adminEmail } })
      || await prisma.user.findUnique({ where: { email: 'admin@minekeys.kh' } });

    if (admin) {
      await prisma.user.update({
        where: { id: admin.id },
        data: { name: adminName, username: adminUsername, email: adminEmail, passwordHash, role: 'ADMIN' },
      });
    } else {
      await prisma.user.create({
        data: { name: adminName, username: adminUsername, email: adminEmail, passwordHash, role: 'ADMIN' },
      });
    }

    const existingProducts = await prisma.product.count();
    if (existingProducts > 0) {
      return NextResponse.json({ message: 'Already seeded', count: existingProducts });
    }

    // Create settings
    const settingsExists = await prisma.siteSettings.findFirst();
    if (!settingsExists) {
      await prisma.siteSettings.create({
        data: {
          storeName: 'MineKeys',
          telegramUsername: process.env.TELEGRAM_ADMIN_USERNAME || 'vanstorev',
          tiktokUsername: process.env.TIKTOK_USERNAME || 'van_magic3',
          facebookUrl: process.env.FACEBOOK_PAGE_URL || 'https://facebook.com/minekeys',
          abaAccount: '',
          acledaAccount: ' ',
          wingAccount: '',
          khqrInstructions: 'ស្កេន KHQR ជាមួយកម្មវិធីធនាគារណាមួយ។ រូបថតអេក្រង់បន្ទាប់ពីការទូទាត់រួច ហើយបង្ហោះវាទៅក្នុងការបញ្ជាទិញរបស់អ្នក។ អ្នកគ្រប់គ្រងផ្ទៀងផ្ទាត់ក្នុងរយៈពេល 5 នាទី។',
        },
      });
    }

    const products = [
      {
        name: 'Minecraft Premium Account',
        category: 'MINECRAFT',
        description: 'Full access Minecraft Java & Bedrock premium account. Instant delivery, email changeable, secure login. Perfect for beginners.',
        price: 9.99,
        stock: 50,
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
      },
      {
        name: 'Minecraft Java Account - Full Access',
        category: 'MINECRAFT',
        description: 'Java Edition full access with migration cape. Change email, password, skin, security questions. Lifetime warranty.',
        price: 12.99,
        stock: 35,
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop',
      },
      {
        name: 'Minecraft Full Access + Hypixel Ready',
        category: 'MINECRAFT',
        description: 'Premium full access account, never banned on Hypixel, clean stats. Includes Optifine cape support and security setup guide.',
        price: 15.99,
        stock: 20,
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
      },
      {
        name: 'Minecraft Bedrock + Java Bundle',
        category: 'MINECRAFT',
        description: 'Get both Java and Bedrock editions in one account. Cross-play ready, Xbox Game Pass compatible.',
        price: 18.5,
        stock: 15,
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop',
      },
      {
        name: 'Gaming Mechanical Keyboard - 60% RGB',
        category: 'KEYBOARD',
        description: 'Compact 60% mechanical keyboard with hot-swappable blue switches, RGB backlight, PBT keycaps. Perfect for gaming and typing.',
        price: 45.0,
        stock: 25,
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=400&fit=crop',
      },
      {
        name: 'RGB Gaming Keyboard - Full Size',
        category: 'KEYBOARD',
        description: 'Full-size mechanical gaming keyboard with 104 keys, customizable RGB, anti-ghosting, wrist rest included. Pro gamer choice.',
        price: 59.99,
        stock: 18,
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=600&h=400&fit=crop',
      },
      {
        name: 'Wireless Gaming Keyboard - Low Latency',
        category: 'KEYBOARD',
        description: '2.4GHz wireless + Bluetooth 5.0, 80-hour battery, ultra-low latency 1ms, RGB, compact TKL design.',
        price: 69.99,
        stock: 12,
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=400&fit=crop',
      },
      {
        name: '60% Mechanical Keyboard - Custom Pink',
        category: 'KEYBOARD',
        description: 'Cute pink 60% keyboard, linear red switches, soft tactile feel, adorable keycaps, perfect for cozy gaming setup. ✨',
        price: 52.5,
        stock: 10,
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=600&h=400&fit=crop',
      },
    ];

    for (const p of products) {
      await prisma.product.create({ data: p });
    }

    return NextResponse.json({ message: 'Seeded successfully' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Seed failed', details: String(e) }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
