'use client';
import { useEffect, useState } from 'react';
import { Send, Video, Users, Mail, MapPin, Clock, Shield } from 'lucide-react';

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d.settings));
  }, []);

  const telegram = settings?.telegramUsername || 'your_admin';
  const tiktok = settings?.tiktokUsername || 'your_tiktok';
  const facebook = settings?.facebookUrl || 'https://facebook.com';

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[36px] md:text-[44px] font-black tracking-tight text-white leading-[0.95]">Let&apos;s talk gaming 🎮</h1>
          <p className="text-[15px] text-white/50 mt-3 max-w-[600px] mx-auto">Fastest support via Telegram. We reply in under 5 minutes. KHQR / ABA / ACLEDA / Wing supported for Cambodian customers.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <a href={`https://t.me/${telegram.replace('@','')}`} target="_blank" className="group relative overflow-hidden rounded-[24px] glass-strong border border-[#229ED9]/20 p-6 hover:border-[#229ED9]/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#229ED9]/15 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-[#229ED9] flex items-center justify-center shadow-lg shadow-[#229ED9]/20"><Send className="w-6 h-6 text-white" /></div>
              <div className="mt-4 font-bold text-white">Telegram</div>
              <div className="text-[13px] text-white/60 mt-1">@{telegram.replace('@','')} • Fastest response</div>
              <div className="mt-3 inline-flex px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-[10px] font-bold tracking-widest text-emerald-300 uppercase">Online now</div>
            </div>
          </a>

          <a href={`https://tiktok.com/@${tiktok.replace('@','')}`} target="_blank" className="group relative overflow-hidden rounded-[24px] glass-strong border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg"><Video className="w-6 h-6" /></div>
              <div className="mt-4 font-bold text-white">TikTok</div>
              <div className="text-[13px] text-white/60 mt-1">@{tiktok.replace('@','')} • Gaming content</div>
              <div className="mt-3 text-[11px] text-white/40">Daily clips & reviews</div>
            </div>
          </a>

          <a href={facebook} target="_blank" className="group relative overflow-hidden rounded-[24px] glass-strong border border-[#1877F2]/20 p-6 hover:border-[#1877F2]/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1877F2]/15 to-transparent" />
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-[#1877F2] flex items-center justify-center shadow-lg shadow-[#1877F2]/20"><Users className="w-6 h-6 text-white" /></div>
              <div className="mt-4 font-bold text-white">Users</div>
              <div className="text-[13px] text-white/60 mt-1">Official page • Trusted</div>
              <div className="mt-3 text-[11px] text-white/40">5k+ followers</div>
            </div>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-[24px] border border-white/5 p-6 space-y-4">
            <h3 className="font-bold text-white">Contact Info</h3>
            <div className="space-y-3 text-[13px]">
              <div className="flex items-center gap-3 text-white/60"><Mail className="w-4 h-4" /> support@mail</div>
              <div className="flex items-center gap-3 text-white/60"><MapPin className="w-4 h-4" /> Phnom Penh, Cambodia 🇰🇭</div>
              <div className="flex items-center gap-3 text-white/60"><Clock className="w-4 h-4" /> 24/7 support via Telegram</div>
              <div className="flex items-center gap-3 text-white/60"><Shield className="w-4 h-4" /> Secure & verified seller</div>
            </div>
            <div className="pt-4">
              <div className="text-[12px] font-semibold text-white mb-2">Payment Methods</div>
              <div className="flex flex-wrap gap-2">
                {['KHQR 🇰🇭', 'ABA Bank', 'ACLEDA', 'Wing'].map(m => <span key={m} className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-white/70">{m}</span>)}
              </div>
            </div>
          </div>

          <div className="glass rounded-[24px] border border-white/5 p-6">
            <h3 className="font-bold text-white mb-4">Send a quick message</h3>
            <form onSubmit={(e) => { e.preventDefault(); const form = e.target as HTMLFormElement; const msg = (form.elements.namedItem('message') as HTMLInputElement).value; window.open(`https://t.me/${telegram.replace('@','')}?text=${encodeURIComponent(msg)}`, '_blank'); }} className="space-y-4">
              <input name="name" placeholder="Your name" className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[13px] focus:outline-none focus:border-violet-500/40" />
              <textarea name="message" placeholder="How can we help? (e.g. I want to buy Minecraft account...)" rows={4} className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[13px] focus:outline-none focus:border-violet-500/40 resize-none" />
              <button className="w-full py-3 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white font-semibold text-[13px] shadow-lg shadow-violet-500/20">Send via Telegram</button>
              <div className="text-[11px] text-white/30 text-center">We&apos;ll reply on Telegram within 5 minutes ⚡</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
