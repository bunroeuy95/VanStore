'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Gamepad2, Keyboard, Shield, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[5%] w-[500px] h-[500px] rounded-full bg-fuchsia-500/15 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[30%] w-[700px] h-[700px] rounded-full bg-cyan-400/10 blur-[130px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Left */}
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/20 text-[11px] font-bold tracking-[0.15em] uppercase text-violet-200"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Trusted by 5,000+ Cambodian gamers
              <Sparkles className="w-3.5 h-3.5 text-violet-300" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[40px] md:text-[56px] lg:text-[64px] font-black leading-[0.95] tracking-[-0.03em] text-white"
            >
              WELCOME TO
              <br />
              <span className="text-gradient">VAN STORE</span>
              <br />
              Minecraft & Keyboards
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[16px] md:text-[18px] leading-relaxed text-white/60 max-w-[520px]"
            >
              Premium Minecraft accounts & pro-grade gaming keyboards. Instant delivery, secure checkout, 24/7 Telegram support. Built for Cambodian gamers who demand the best.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="#minecraft"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white font-semibold text-[14px] shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all"
              >
                <Gamepad2 className="w-5 h-5" />
                Shop Minecraft Accounts
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#keyboards"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass border border-white/10 text-white font-medium text-[14px] hover:bg-white/[0.08] hover:border-white/15 transition-all"
              >
                <Keyboard className="w-5 h-5" />
                Shop Keyboards
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-2"
            >
              {[
                { icon: Shield, label: 'Secure Orders', sub: 'Escrow protected' },
                { icon: Zap, label: 'Instant Delivery', sub: '< 5 minutes' },
                { icon: Gamepad2, label: '5k+ Happy Gamers', sub: '4.9/5 rating' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-white/70" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white leading-none">{item.label}</div>
                    <div className="text-[11px] text-white/45">{item.sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', damping: 20 }}
            className="relative lg:h-[560px] flex items-center justify-center"
          >
            {/* Main Card */}
            <div className="relative w-full max-w-[440px]">
              {/* Glow */}
              <div className="absolute -inset-6 bg-gradient-to-br from-violet-600/30 to-fuchsia-500/30 blur-[40px] rounded-[32px]" />
              
              {/* Minecraft floating cards */}
              <div className="relative glass-strong rounded-[28px] p-6 md:p-7 shadow-2xl border border-white/10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[10px] tracking-widest font-bold text-white/30 uppercase">Premium Store</div>
                </div>

                {/* Product preview stack */}
                <div className="space-y-4">
                  {[
                    { name: 'Minecraft Account', price: '$10', badge: '🔥 Best Seller', color: 'from-emerald-500 to-teal-500' },
                    { name: 'Gaming Keyboard 60%', price: '$15', badge: '⚡ Limited', color: 'from-violet-500 to-fuchsia-500' },
                    { name: 'accessory', price: 'SOON', badge: '✅ SOON', color: 'from-cyan-500 to-blue-500' },
                  ].map((p, i) => (
                    <motion.div
                      key={p.name}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="group flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-pointer"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-[18px]">{i === 1 ? '⌨️' : '⛏️'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-white truncate">{p.name}</div>
                        <div className="text-[11px] text-white/50">{p.badge}</div>
                      </div>
                      <div className="text-[13px] font-bold text-white">{p.price}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-500/20 border border-violet-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] tracking-widest font-bold text-violet-300 uppercase">Secure Checkout</div>
                      <div className="text-[13px] font-medium text-white mt-1">KHQR • ABA • ACLEDA • Wing</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-[18px]">V</div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-lg shadow-emerald-500/30 border border-white/20"
              >
                ✓ Instant Delivery
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-3 -left-6 px-3 py-1.5 rounded-full bg-white text-black text-[11px] font-bold shadow-xl border border-black/5"
              >
                🔐 100% Secure
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
