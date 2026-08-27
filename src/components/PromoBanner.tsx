'use client';
import { motion } from 'framer-motion';

export default function PromoBanner() {
  const items = [
    '🔥 PREMIUM MINECRAFT ACCOUNTS',
    '⌨️ GAMING KEYBOARDS',
    '🚀 FAST SUPPORT 24/7',
    '🔐 SECURE ORDERS',
    '🇰🇭 TRUSTED IN CAMBODIA',
    '💎 FULL ACCESS GUARANTEE',
    '🎮 PRO GAMERS CHOICE',
  ];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 py-2.5">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-[shimmer_2s_infinite]" />
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-10 pr-10">
            {items.map((text, idx) => (
              <span key={idx} className="flex items-center gap-10 text-[12.5px] font-black tracking-[0.12em] text-white">
                {text}
                <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
