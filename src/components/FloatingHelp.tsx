'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Video, Users, Sparkles } from 'lucide-react';
import { config } from '@/lib/config';

export default function FloatingHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="w-[320px] glass-strong rounded-[24px] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-5 bg-gradient-to-br from-violet-600/20 to-fuchsia-500/20 border-b border-white/5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white text-[15px] flex items-center gap-2">
                      Hi 👋 Need help?
                      <Sparkles className="w-4 h-4 text-violet-300" />
                    </div>
                    <div className="text-[13px] text-white/60 mt-1 leading-relaxed">
                      Need help choosing an account or keyboard? We&apos;re here 24/7!
                    </div>
                  </div>
                  <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2.5">
                <a href={`https://t.me/${config.telegramUsername.replace('@','')}`} target="_blank" className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-[#229ED9] text-white font-medium text-[13px] hover:bg-[#1c8bc0] transition">
                  <Send className="w-4 h-4" /> Chat on Telegram
                  <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full">FASTEST</span>
                </a>
                <a href={`https://tiktok.com/@${config.tiktokUsername.replace('@','')}`} target="_blank" className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white/80 font-medium text-[13px] hover:bg-white/[0.1] hover:text-white transition">
                  <Video className="w-4 h-4" /> TikTok
                </a>
                <a href={config.facebookUrl} target="_blank" className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white/80 font-medium text-[13px] hover:bg-white/[0.1] hover:text-white transition">
                  <Users className="w-4 h-4" /> Users
                </a>
                <div className="pt-2 text-center text-[11px] text-white/30">Avg. response time: &lt; 5 minutes ⚡</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white font-semibold text-[13px] shadow-xl shadow-violet-500/30 border border-white/10"
        >
          {open ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
          {open ? 'Close' : '💬 Need Help?'}
        </motion.button>
      </div>
    </>
  );
}
