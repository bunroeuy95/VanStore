'use client';
import { Shield, Zap, CreditCard, MessageCircle, Package, Check } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-[36px] font-black tracking-tight text-white">Help Center</h1>
        <p className="text-white/50 mt-2">Everything you need to know about buying from MineKeys</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          { icon: Zap, title: 'How to Buy', desc: 'Product → Buy Now → Order → Telegram' },
          { icon: CreditCard, title: 'Payment', desc: 'KHQR, ABA, ACLEDA, Wing supported' },
          { icon: Shield, title: 'Secure', desc: 'Escrow protected & verified' },
        ].map((item) => (
          <div key={item.title} className="glass rounded-2xl border border-white/5 p-5 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center"><item.icon className="w-5 h-5 text-violet-300" /></div>
            <div className="font-semibold text-white mt-3 text-[14px]">{item.title}</div>
            <div className="text-[12px] text-white/50 mt-1">{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <section className="glass-strong rounded-[24px] border border-white/10 p-8">
          <h2 className="text-[20px] font-bold text-white flex items-center gap-2"><Package className="w-5 h-5" /> How does buying work?</h2>
          <div className="mt-6 grid md:grid-cols-5 gap-4">
            {[
              { step: '1', title: 'Choose Product', desc: 'Browse Minecraft or keyboards' },
              { step: '2', title: 'Buy Now', desc: 'Click Buy Now, order auto-created' },
              { step: '3', title: 'Order Details', desc: 'See price, ID, your name' },
              { step: '4', title: 'Payment', desc: 'Pay via KHQR/ABA/ACLEDA/Wing' },
              { step: '5', title: 'Telegram Admin', desc: 'Auto message to confirm' },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-[13px]">{s.step}</div>
                <div className="font-semibold text-white text-[13px] mt-3">{s.title}</div>
                <div className="text-[11px] text-white/50 mt-1">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-[12px] text-violet-200">
            ✨ Customer never has to manually type product name. Order info is auto-generated for Telegram!
          </div>
        </section>

        <section className="glass rounded-[24px] border border-white/5 p-8">
          <h2 className="text-[18px] font-bold text-white flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment for Cambodian Customers</h2>
          <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-white/60">
            <p><strong className="text-white">KHQR:</strong> Scan QR image provided by admin. Show payment instructions. Upload screenshot securely. Marked as <em>Pending Verification</em> until admin verifies. We never claim success based only on screenshot.</p>
            <p><strong className="text-white">ABA / ACLEDA / Wing:</strong> Contact admin on Telegram for account number. After transfer, upload proof in your profile order history.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {['KHQR - Instant', 'ABA - Fast', 'ACLEDA - Secure', 'Wing - Easy'].map(t => <div key={t} className="px-3 py-2 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-center text-white/70">{t}</div>)}
            </div>
          </div>
        </section>

        <section className="glass rounded-[24px] border border-white/5 p-8">
          <h2 className="text-[18px] font-bold text-white">FAQs</h2>
          <div className="mt-6 space-y-4">
            {[
              { q: 'Are Minecraft accounts full access?', a: 'Yes! You can change email, password, skin, security questions. Lifetime warranty if you follow our guide.' },
              { q: 'How fast is delivery?', a: 'Instant after payment verification. Average < 5 minutes. 24/7 Telegram support.' },
              { q: 'What if I need help choosing?', a: 'Click 💬 Need Help? floating button. We help you pick best account or keyboard for your budget.' },
              { q: 'Is my order secure?', a: '100% secure. We use escrow, secure hashing, protected admin routes, rate limiting, and verified seller badge.' },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-white/5 pb-4 last:border-0">
                <div className="font-medium text-white text-[13.5px] flex gap-2"><Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> {faq.q}</div>
                <div className="text-[12.5px] text-white/50 mt-1 ml-6">{faq.a}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-center gap-3">
          <Link href="/contact" className="px-6 py-3 rounded-full bg-white text-black font-semibold text-[13px]">Contact Support</Link>
          <Link href="/" className="px-6 py-3 rounded-full bg-white/[0.06] border border-white/10 text-white font-medium text-[13px]">Back to Shop</Link>
        </div>
      </div>
    </div>
  );
}
