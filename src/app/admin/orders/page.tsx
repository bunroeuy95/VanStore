'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatDate } from '@/lib/utils';

type Order = {
  id: string;
  orderCode: string;
  productName: string;
  price: number;
  productImage?: string | null;
  customerName: string;
  status: string;
  paymentMethod?: string;
  paymentProofUrl?: string;
  createdAt: string;
  user?: { username: string; email: string };
};

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => { if (user?.role === 'ADMIN') fetchOrders(); }, [user]);

  const fetchOrders = async () => {
    const res = await fetch('/api/orders?all=true');
    const data = await res.json();
    setOrders(data.orders || []);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (res.ok) { showToast(`Order status → ${status}`, 'success'); fetchOrders(); } else showToast('Failed', 'error');
  };

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="p-20 text-center text-white/50">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <h1 className="text-[26px] font-black text-white mb-6">Orders Management</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'Pending', 'Pending Verification', 'Waiting for Payment', 'Paid', 'Processing', 'Completed', 'Cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-full text-[12px] font-medium border transition ${filter === s ? 'bg-white text-black border-white' : 'bg-white/[0.06] border-white/10 text-white/60 hover:text-white'}`}>{s}</button>
        ))}
      </div>

      <div className="glass-strong rounded-[20px] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead className="bg-white/[0.04] border-b border-white/5 text-[11px] tracking-widest uppercase text-white/40">
              <tr><th className="text-left p-4">Order</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Product</th><th className="text-left p-4">Payment</th><th className="text-left p-4">Status</th><th className="text-right p-4">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="p-4"><div className="font-mono font-bold text-white">{o.orderCode}</div><div className="text-[11px] text-white/40">{formatDate(o.createdAt)}</div></td>
                  <td className="p-4"><div className="font-medium text-white">{o.customerName}</div><div className="text-[11px] text-white/40">{o.user?.username || 'Guest'} • {o.user?.email || ''}</div></td>
                  <td className="p-4 flex items-center gap-2"><div className="w-8 h-8 rounded-lg overflow-hidden bg-white/[0.06]">{o.productImage ? <img src={o.productImage} alt={o.productName} className="w-full h-full object-cover" /> : '🎮'}</div><div><div className="font-medium text-white">{o.productName}</div><div className="text-[11px] text-white/50">{formatPrice(o.price)}</div></div></td>
                  <td className="p-4"><div className="text-white/70">{o.paymentMethod || 'KHQR'}</div>{o.paymentProofUrl && <a href={o.paymentProofUrl} target="_blank" className="text-[11px] text-violet-300 underline">View proof</a>}</td>
                  <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${o.status === 'Completed' ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-200' : o.status === 'Pending Verification' ? 'bg-amber-500/15 border-amber-500/20 text-amber-200' : o.status === 'Cancelled' ? 'bg-red-500/15 border-red-500/20 text-red-200' : 'bg-white/10 border-white/10 text-white/60'}`}>{o.status}</span></td>
                  <td className="p-4 text-right">
                    <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="px-2 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-white focus:outline-none">
                      <option className="bg-[#0f1220]" value="Pending">Pending</option>
                      <option className="bg-[#0f1220]" value="Waiting for Payment">Waiting for Payment</option>
                      <option className="bg-[#0f1220]" value="Pending Verification">Pending Verification</option>
                      <option className="bg-[#0f1220]" value="Paid">Paid</option>
                      <option className="bg-[#0f1220]" value="Processing">Processing</option>
                      <option className="bg-[#0f1220]" value="Completed">Completed</option>
                      <option className="bg-[#0f1220]" value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-12 text-center text-white/40">No orders found</div>}
        </div>
      </div>
    </div>
  );
}
