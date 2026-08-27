'use client';
import Link from 'next/link';
import { Gamepad2, Send, Video, Users, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { config } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/[0.06] bg-[#080a14]/80 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-violet-950/10 to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-[1280px] px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-6 h-6 text-black" />
              </div>
              <div>
                <div className="font-black text-[18px] leading-none text-white">VAN STORE</div>
                <div className="text-[10px] tracking-[0.18em] text-white/40 font-semibold uppercase">Minecraft & Keybord</div>
              </div>
            </div>
            <p className="text-[13.5px] leading-relaxed text-white/60 max-w-[300px]">
              Cambodia&apos;s premium gaming shop. Authentic Minecraft accounts & pro-grade mechanical keyboards. Fast support, secure orders, trusted by 5,000+ gamers.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Seller
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-[13px] tracking-widest uppercase">Shop</h4>
            <ul className="space-y-3 text-[13.5px]">
              <li><Link href="/#minecraft" className="text-white/60 hover:text-white transition">Minecraft Accounts</Link></li>
              <li><Link href="/#keyboards" className="text-white/60 hover:text-white transition">Gaming Keyboards</Link></li>
              <li><Link href="/wishlist" className="text-white/60 hover:text-white transition">Wishlist / Favorites</Link></li>
              <li><Link href="/profile" className="text-white/60 hover:text-white transition">My Orders</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-[13px] tracking-widest uppercase">Help Center</h4>
            <ul className="space-y-3 text-[13.5px]">
              <li><Link href="/help" className="text-white/60 hover:text-white transition">How to buy</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-white transition">Contact us</Link></li>
              <li><span className="text-white/60">Payment: KHQR / ABA / ACLEDA / Wing</span></li>
              <li><span className="text-white/60">Support: 24/7 Telegram</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-[13px] tracking-widest uppercase">Connect</h4>
            <div className="flex flex-col gap-2.5">
              <a href={`https://t.me/${config.telegramUsername.replace('@','')}`} target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#229ED9]/15 border border-[#229ED9]/20 text-[#7dd3ff] hover:bg-[#229ED9]/25 transition text-[13px] font-medium">
                <Send className="w-4 h-4" /> Telegram: @{config.telegramUsername.replace('@','')}
              </a>
              <a href={`https://tiktok.com/@${config.tiktokUsername.replace('@','')}`} target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/10 text-white/80 hover:bg-white/[0.1] transition text-[13px] font-medium">
                <Video className="w-4 h-4" /> TikTok: @{config.tiktokUsername.replace('@','')}
              </a>
              <a href={config.facebookUrl} target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#1877F2]/15 border border-[#1877F2]/20 text-[#8ab4ff] hover:bg-[#1877F2]/25 transition text-[13px] font-medium">
                <Users className="w-4 h-4" /> Users Page
              </a>
            </div>
            <div className="mt-4 space-y-2 text-[12px] text-white/40">
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> support@mail</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Phnom Penh, Cambodia</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[12.5px] text-white/40">© 2026 VAN STORE. All rights reserved. Built for ROEUY MC 🎮</div>
          <div className="flex items-center gap-3 text-[11px] text-white/30">
            <span>🔐 Secure Orders</span>
            <span>•</span>
            <span>⚡ Fast Delivery</span>
            <span>•</span>
            <span>🇰🇭 Cambodia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
