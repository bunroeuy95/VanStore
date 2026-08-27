'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { formatPrice, formatDate, generateTelegramOrderMessage } from '@/lib/utils';
import { Package, Upload, Send } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { getTelegramLink } from '@/lib/config';

type Order = {
  id: string;
  orderCode: string;
  productName: string;
  price: number;
  productImage?: string | null;
  status: string;
  paymentMethod?: string;
  paymentProofUrl?: string;
  createdAt: string;
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const { showToast } = useToast();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/orders').then(r => r.json()).then(d => {
        setOrders(d.orders || []);
        setOrdersLoading(false);
      });
    }
  }, [user]);

  const handleProofUpload = async (orderId: string, file: File) => {
    setUploadingId(orderId);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('orderId', orderId);
      const res = await fetch('/api/payment-proof', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast('Payment photo saved for admin verification', 'success');
      // Refresh
      const refreshed = await fetch('/api/orders').then(r => r.json());
      setOrders(refreshed.orders || []);
    } catch (e: any) {
      showToast(e.message || 'Upload failed', 'error');
    } finally {
      setUploadingId(null);
    }
  };

  const handleTelegramChat = async (order: Order) => {
    if (!order.paymentProofUrl) {
      showToast('Upload your payment photo first', 'error');
      return;
    }
    const telegramWindow = window.open('', '_blank');
    setSendingId(order.id);
    try {
      const res = await fetch('/api/payment-proof/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send payment photo');
      showToast(data.partial ? 'Sent to Telegram admin; group delivery failed' : 'Payment photo sent to Telegram', data.partial ? 'error' : 'success');
      if (telegramWindow) telegramWindow.location.href = getTelegramLink(generateTelegramOrderMessage({ productName: order.productName, price: order.price, orderId: order.orderCode, customerName: user?.name || 'Customer', productImage: order.productImage || undefined }));
    } catch (e: any) {
      telegramWindow?.close();
      showToast(e.message || 'Could not send payment photo', 'error');
    } finally {
      setSendingId(null);
    }
  };

  if (loading) return <div className="p-20 text-center text-white/50">Loading...</div>;
  if (!user) return null;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        {/* Profile card */}
        <div className="glass-strong rounded-[24px] border border-white/10 p-6 h-fit">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 flex items-center justify-center text-[20px] font-black text-white">{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <div className="font-bold text-white">{user.name}</div>
              <div className="text-[12px] text-white/50">@{user.username}</div>
              <div className="text-[11px] text-white/30">{user.email}</div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-[12px]"><span className="text-white/50">Role</span><span className="font-medium text-white px-2 py-0.5 rounded-full bg-white/10">{user.role}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-white/50">Orders</span><span className="font-bold text-white">{orders.length}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-white/50">Member since</span><span className="text-white/70">2026</span></div>
          </div>
          {user.role === 'ADMIN' && (
            <a href="/admin" className="mt-6 block w-full text-center py-2.5 rounded-full bg-amber-400 text-black font-semibold text-[13px]">Admin Dashboard</a>
          )}
        </div>

        {/* Orders */}
        <div className="space-y-6">
          <h1 className="text-[26px] font-black tracking-tight text-white flex items-center gap-3"><Package className="w-6 h-6" /> Order History</h1>

          {ordersLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="glass rounded-2xl border border-white/5 p-12 text-center">
              <div className="text-4xl mb-3">📦</div>
              <div className="font-bold text-white">No orders yet</div>
              <div className="text-[13px] text-white/50 mt-1">Your orders will appear here after purchase</div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="glass rounded-2xl border border-white/5 p-5 flex flex-col md:flex-row gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/[0.04] border border-white/5 shrink-0">
                    {order.productImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={order.productImage} alt={order.productName} className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full flex items-center justify-center">🎮</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold text-white text-[14px]">{order.productName}</div>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70">{order.orderCode}</span>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium border ${
                        order.status === 'Completed' ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-200' :
                        order.status === 'Pending Verification' ? 'bg-amber-500/15 border-amber-500/20 text-amber-200' :
                        order.status === 'Cancelled' ? 'bg-red-500/15 border-red-500/20 text-red-200' :
                        'bg-white/10 border-white/10 text-white/60'
                      }`}>{order.status}</span>
                    </div>
                    <div className="text-[12px] text-white/50 mt-1">{formatDate(order.createdAt)} • {order.paymentMethod || 'KHQR'} • {formatPrice(order.price)}</div>
                    {order.paymentProofUrl && (
                      <div className="mt-2 text-[11px] text-white/40">Proof: <a href={order.paymentProofUrl} target="_blank" className="text-violet-300 underline">View uploaded screenshot</a></div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 md:items-end">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-[12px] font-medium text-white/80 hover:bg-white/[0.1] cursor-pointer transition">
                      <Upload className="w-4 h-4" /> {uploadingId === order.id ? 'Uploading...' : 'Upload Photo'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleProofUpload(order.id, f); }} />
                    </label>
                    <button onClick={() => handleTelegramChat(order)} disabled={sendingId === order.id} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#229ED9] text-white text-[12px] font-medium disabled:opacity-50">
                      <Send className="w-3.5 h-3.5" /> {sendingId === order.id ? 'Sending photo...' : 'Send Photo & Chat'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
