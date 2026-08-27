'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back! 🎮', 'success');
      router.push('/');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Image src="/vercel.svg" alt="Vercel logo" width={28} height={28} className="w-7 h-7" />
          </div>
          <h1 className="text-[28px] font-black tracking-tight text-white mt-4">Login Account</h1>
          <p className="text-[13.5px] text-white/50 mt-1">Login to continue your gaming journey</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong rounded-[28px] border border-white/10 p-7 space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-widest uppercase text-white/50">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@gmail.com" className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-violet-500/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-widest uppercase text-white/50">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-violet-500/50" />
            </div>
          </div>

          <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white font-semibold text-[14px] shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 disabled:opacity-50 transition">
            {loading ? 'Logging in...' : 'Login'} <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center text-[13px] text-white/50">
            Don&apos;t have an account? <Link href="/register" className="text-violet-300 font-semibold hover:text-violet-200">Sign up</Link>
          </div>

        </form>
      </div>
    </div>
  );
}
