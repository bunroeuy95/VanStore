'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/#minecraft', label: 'Minecraft Accounts' },
    { href: '/#keyboards', label: 'Keyboards' },
    { href: '/contact', label: 'Contact' },
    { href: '/help', label: 'Help' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 w-full glass-strong border-b border-white/[0.06]"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-15 h-15 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 transition-all duration-300 group-hover:shadow-violet-500/40 group-hover:scale-105" aria-label="Van Store logo">
              <Image src="/vercel.svg" alt="Vercel logo" width={20} height={20} className="w-10 h-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[18px] leading-none tracking-tight text-white">VAN STORE</span>
              <span className="text-[10px] tracking-[0.18em] text-white/50 font-semibold uppercase">Minecraft & Keyboards</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.04] rounded-full p-1 border border-white/[0.06]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-[13.5px] font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-white text-black shadow'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/wishlist"
              className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <Heart className="w-[18px] h-[18px]" />
            </Link>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/10 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 flex items-center justify-center text-[12px] font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-medium text-white/90 max-w-[90px] truncate">{user.username}</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/20 hover:scale-105 transition"
                  >
                    <Shield className="w-5 h-5" />
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-full text-[13.5px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-full bg-white text-black text-[13.5px] font-semibold shadow hover:bg-white/90 transition"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[84%] max-w-[340px] glass-strong border-l border-white/10 p-6 pt-[88px] flex flex-col"
            >
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-white/90 font-medium hover:bg-white/[0.08] transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 flex items-center justify-center font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{user.username}</div>
                        <div className="text-xs text-white/50">{user.email}</div>
                      </div>
                    </Link>
                    <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.04] text-white/80">
                      <Heart className="w-4 h-4" /> Wishlist
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/20">
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 text-red-300 border border-red-500/20">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="px-5 py-3 rounded-full bg-white/[0.08] border border-white/10 text-center text-white font-medium">
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="px-5 py-3 rounded-full bg-white text-black text-center font-semibold">
                      Create account
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold tracking-widest text-emerald-300 uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Secure & Trusted Store
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
