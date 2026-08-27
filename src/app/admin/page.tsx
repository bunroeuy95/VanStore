'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingBag, DollarSign, TrendingUp, Settings, RotateCcw } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/orders?all=true').then(r => r.json()),
      ]).then(([prodData, orderData]) => {
        const revenue = (orderData.orders || []).reduce((sum: number, o: any) => sum + o.price, 0);
        setStats({ products: prodData.products?.length || 0, orders: orderData.orders?.length || 0, users: 0, revenue });
      });
    }
  }, [user]);

  if (loading) return <div className="p-20 text-center text-white/50">Loading admin...</div>;
  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[30px] font-black tracking-tight text-white">Admin Dashboard</h1>
          <p className="text-[13px] text-white/50 mt-1">Manage products, orders, customers, and store settings</p>
        </div>
        <Link href="/admin/settings" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-white text-[13px]"><Settings className="w-4 h-4" /> Settings</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Products', value: stats.products, icon: Package, color: 'from-violet-500 to-fuchsia-500' },
          { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'from-emerald-500 to-teal-500' },
          { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'from-amber-400 to-orange-500' },
          { label: 'Growth', value: '+23%', icon: TrendingUp, color: 'from-cyan-400 to-blue-500' },
        ].map((stat) => (
          <div key={stat.label} className="glass-strong rounded-[20px] border border-white/10 p-5">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}><stat.icon className="w-5 h-5 text-white" /></div>
              <div className="text-[11px] font-bold tracking-widest uppercase text-white/30">{stat.label}</div>
            </div>
            <div className="text-[28px] font-black text-white mt-4">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/products" className="group glass rounded-[20px] border border-white/10 p-6 hover:border-violet-500/30 transition-all hover:scale-[1.02]">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center"><Package className="w-6 h-6 text-white" /></div>
          <div className="font-bold text-white mt-4">Manage Products</div>
          <div className="text-[12px] text-white/50 mt-1">Add, edit, delete products, upload images, change price & stock</div>
          <div className="mt-4 text-[12px] font-medium text-violet-300 group-hover:text-violet-200">Open →</div>
        </Link>

        <Link href="/admin/orders" className="group glass rounded-[20px] border border-white/10 p-6 hover:border-emerald-500/30 transition-all hover:scale-[1.02]">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-white" /></div>
          <div className="font-bold text-white mt-4">View Orders</div>
          <div className="text-[12px] text-white/50 mt-1">Check orders, change status: Pending, Paid, Processing, Completed...</div>
          <div className="mt-4 text-[12px] font-medium text-emerald-300 group-hover:text-emerald-200">Open →</div>
        </Link>

        <Link href="/admin/settings" className="group glass rounded-[20px] border border-white/10 p-6 hover:border-amber-500/30 transition-all hover:scale-[1.02]">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"><Settings className="w-6 h-6 text-black" /></div>
          <div className="font-bold text-white mt-4">Store Settings</div>
          <div className="text-[12px] text-white/50 mt-1">Edit Telegram, TikTok, Facebook links, KHQR, payment info, store name</div>
          <div className="mt-4 text-[12px] font-medium text-amber-300 group-hover:text-amber-200">Open →</div>
        </Link>
      </div>

      <div className="mt-10 glass rounded-[20px] border border-white/5 p-6">
        <h3 className="font-bold text-white mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => fetch('/api/seed', { method: 'POST' }).then(() => alert('Store data updated. Refresh page.'))} className="px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-[12px] text-white/80 hover:bg-white/[0.1]">🌱 Update store data</button>
          <button onClick={() => setStats({ products: 0, orders: 0, users: 0, revenue: 0 })} title="Reset dashboard stats to 0" aria-label="Reset dashboard stats to 0" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-[12px] text-white/80 hover:bg-white/[0.1]"><RotateCcw className="w-3.5 h-3.5" /> Reset stats to 0</button>
          <a href="/" className="px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-[12px] text-white/80 hover:bg-white/[0.1]">🏠 View storefront</a>
        </div>
      </div>
    </div>
  );
}
