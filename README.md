# MineKeys - Premium Minecraft Accounts & Gaming Keyboards

Cute, premium, modern e-commerce for Cambodian gamers. Dark gaming theme with soft neon accents, glassmorphism, rounded cards, smooth animations.

## ✨ Features

- **Homepage**: Hero "Your Gaming Journey Starts Here", promo marquee banner, trust badges
- **Product System**: Minecraft accounts & keyboards, stock status, featured, search, filter, sort
- **Buy Now → Telegram Admin**: Auto-generated order message with Order ID, product, price, customer name. Opens `https://t.me/{TELEGRAM_ADMIN_USERNAME}?text=...`
- **Product Image Upload**: Admin upload, local `/public/uploads`, attached to orders, step to send image in Telegram
- **Contact**: Telegram, TikTok, Facebook with config variables
- **Floating Help**: 💬 Need Help? animated panel
- **User System**: Register, Login, Logout, Profile, Order history, Wishlist ("I'll think about it again" ❤️)
- **Backend + DB**: Next.js API routes, Prisma, SQLite (dev) / PostgreSQL (prod)
- **Admin Dashboard** `/admin`: products CRUD, image upload, orders with status (Pending, Waiting for Payment, Paid, Processing, Completed, Cancelled, Pending Verification), customers, site settings
- **Payment UI**: KHQR (QR image + instructions), ABA, ACLEDA, Wing. Upload payment screenshot → Pending Verification (never auto-success)
- **Security**: bcrypt password hashing, JWT httpOnly cookie, input validation, admin role protection, file type/size validation, env secrets
- **UX**: smooth scrolling, hover effects, card animations, skeleton loading, toast, modals, mobile nav, sticky navbar, back-to-top, search/filter/sort

## 🛠 Stack

- Frontend: Next.js 16 App Router, React 19, Tailwind CSS 4, Framer Motion, Lucide Icons
- Backend: Next.js API routes, Node.js
- DB: Prisma ORM, SQLite (default) / PostgreSQL
- Auth: bcryptjs + jsonwebtoken (JWT httpOnly cookie)
- Storage: Local `/public/uploads` (Cloudinary ready)

## 📁 Database Models

- `User`: id, name, username, email, passwordHash, role, createdAt
- `Product`: id, name, category, description, price, imageUrl, stock, featured, createdAt, updatedAt
- `Order`: id, orderCode (#MC1024), userId, productId, productName, price, productImage, customerName, status, paymentMethod, paymentProofUrl, createdAt
- `Wishlist`: id, userId, productId
- `SiteSettings`: telegramUsername, tiktokUsername, facebookUrl, storeName, khqrImageUrl, abaAccount, etc.

## 🚀 Quick Start

```bash
npm install
```

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-in-production"
TELEGRAM_ADMIN_USERNAME="your_telegram_username_without_@"
TELEGRAM_BOT_TOKEN="your_bot_token"
TELEGRAM_ADMIN_CHAT_ID="your_admin_chat_id"
TELEGRAM_GROUP_CHAT_ID="your_group_chat_id"
TIKTOK_USERNAME="your_tiktok"
FACEBOOK_PAGE_URL="https://facebook.com/yourpage"
```

Setup DB:

```bash
npx prisma migrate dev --name init
# or for existing db
npx prisma db push
npx prisma generate
```

Seed demo data (admin + products):

```bash
# Option 1: via API after starting dev server
curl -X POST http://localhost:3000/api/seed

# Option 2: auto-seeded on first homepage load (calls /api/seed)
```

Run:

```bash
npm run dev
```

Open http://localhost:3000

**Admin login**: `admin@minekeys.kh` / `admin123` (after seed)

## 🔧 Configuration

All Telegram/social config is centralized in `src/lib/config.ts` reading from env:

- `TELEGRAM_ADMIN_USERNAME` - used for Buy Now flow
- `TELEGRAM_BOT_TOKEN` - server-only token used to send payment photos
- `TELEGRAM_ADMIN_CHAT_ID` - private admin chat ID that receives payment photos
- `TELEGRAM_GROUP_CHAT_ID` - group chat ID that receives payment photos
- `TIKTOK_USERNAME`
- `FACEBOOK_PAGE_URL`

Also editable in Admin → Settings (`SiteSettings` table).

**Important**: Never hardcode admin username throughout code. Use `TELEGRAM_ADMIN_USERNAME` env.

## 💬 Telegram Buy Flow

`Product → Buy Now → Order Details → Payment → Telegram Admin`

1. User clicks **Buy Now**
2. Order modal shows product info, image, price, customer name, Order ID
3. System creates order in DB (stock decrement, status Pending)
4. Auto-generates message:
   ```
   🛒 NEW ORDER
   Product: Minecraft Premium Account
   Price: $10
   Order ID: #MC1024
   Customer: [Name]
   Please confirm my order.
   ```
5. Button opens `https://t.me/{admin}?text={message}`
6. Note: "Send Product Image" step reminds customer to send image in chat (Telegram URL can't auto-attach image)

## 💳 Payment (Cambodia)

- KHQR: show QR image (admin uploads in settings), instructions, upload screenshot
- ABA, ACLEDA, Wing: account numbers from settings
- Upload proof → status `Pending Verification`
- Admin verifies in `/admin/orders` → change to Paid/Completed
- **Security**: Never mark success from screenshot alone

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT httpOnly, secure, sameSite lax, 7d expiry
- Admin routes protected (role check)
- File upload: only image/jpeg/png/webp/gif, max 5MB, stored in `/public/uploads`
- Input validation on all APIs
- Env secrets never exposed to frontend (except NEXT_PUBLIC_ prefixed)

## 📱 Responsive

Fully responsive: PC, tablet, mobile. Mobile nav drawer, sticky navbar, touch-friendly.

## 🗂 Project Structure

```
src/
  app/
    api/ (auth, products, orders, wishlist, settings, upload, payment-proof, seed)
    admin/ (dashboard, products, orders, settings)
    product/[id]/
    login/, register/, profile/, wishlist/, contact/, help/
    page.tsx (homepage), layout.tsx, globals.css
  components/ (Navbar, Footer, Hero, PromoBanner, ProductCard, OrderModal, FloatingHelp)
  context/ (AuthContext, ToastContext)
  lib/ (prisma, auth, config, utils)
prisma/schema.prisma
public/uploads/
```

## 🌐 Production - PostgreSQL

Change `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
}
```

Set `DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"` in `.env`, then:

```bash
npx prisma migrate dev
npx prisma generate
npm run build
npm start
```

## 📝 TODO / Extensions

- Cloudinary integration (replace local upload)
- Email notifications
- Real KHQR payment verification API
- Reviews/ratings

## © 2026 MineKeys Gaming Store. All rights reserved.

Built for Cambodian gamers 🎮🇰🇭
