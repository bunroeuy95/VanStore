'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import OrderModal from '@/components/OrderModal';
import { ShoppingCart, Heart, Package, Shield, Truck, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  stock: number;
  featured?: boolean;
};

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => r.json()).then(d => {
      setProduct(d.product);
      setLoading(false);
    });
  }, [id]);

  const handleWishlist = async () => {
    if (!user) { showToast('Login to save favorites', 'info'); return; }
    const res = await fetch('/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: id }) });
    const data = await res.json();
    showToast(data.message || 'Updated', 'success');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square skeleton rounded-[28px]" />
          <div className="space-y-4">
            <div className="h-8 skeleton rounded-full" />
            <div className="h-4 skeleton rounded-full w-3/4" />
            <div className="h-20 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="p-20 text-center text-white">Product not found</div>;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-white/50 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative">
          <div className="aspect-[4/3] rounded-[28px] overflow-hidden glass-strong border border-white/10 bg-white/[0.03]">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">{product.category === 'MINECRAFT' ? '⛏️' : '⌨️'}</div>
            )}
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-bold tracking-widest uppercase text-white">{product.category}</span>
            {product.featured && <span className="px-3 py-1.5 rounded-full bg-amber-400 text-black text-[11px] font-bold">🔥 Featured</span>}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-[32px] font-black tracking-tight text-white leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-[12px] text-white/50">4.9 (234 reviews)</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${product.stock > 0 ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-200' : 'bg-red-500/15 border-red-500/20 text-red-200'}`}>
                <Package className="w-3 h-3" /> {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <div className="text-[36px] font-black text-white">{formatPrice(product.price)}</div>
            <div className="text-[14px] text-white/30 line-through">${(product.price * 1.3).toFixed(2)}</div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold">SAVE 30%</div>
          </div>

          <div className="glass rounded-2xl border border-white/5 p-5">
            <h3 className="font-semibold text-white text-[14px] mb-2">Description</h3>
            <p className="text-[13.5px] leading-relaxed text-white/60">{product.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, label: 'Secure', sub: 'Escrow protected' },
              { icon: Truck, label: 'Instant', sub: '< 5 min delivery' },
              { icon: Package, label: 'Warranty', sub: 'Full access' },
            ].map((f) => (
              <div key={f.label} className="glass rounded-2xl border border-white/5 p-3 text-center">
                <f.icon className="w-5 h-5 mx-auto text-violet-300" />
                <div className="text-[12px] font-semibold text-white mt-1">{f.label}</div>
                <div className="text-[10px] text-white/40">{f.sub}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-[1.5fr_1fr] gap-3">
              <button onClick={() => setModalOpen(true)} disabled={product.stock <= 0} className="inline-flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white font-bold text-[15px] shadow-xl shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 transition-all">
                <ShoppingCart className="w-5 h-5" /> Buy Now - {formatPrice(product.price)}
              </button>
              <button onClick={handleWishlist} className="inline-flex items-center justify-center gap-2 py-4 rounded-full bg-white/[0.06] border border-white/10 text-white font-medium text-[14px] hover:bg-white/[0.1] transition">
                <Heart className="w-5 h-5" /> Save
              </button>
            </div>
            <div className="text-center text-[11px] text-white/30">Product → Buy Now → Order Details → Payment → Telegram Admin ✨ No manual typing needed</div>
          </div>

          <div className="glass rounded-2xl border border-white/5 p-4">
            <div className="text-[12px] font-semibold text-white mb-2">Payment Methods for Cambodian customers</div>
            <div className="flex flex-wrap gap-2">
              {['🇰🇭 KHQR', 'ABA', 'ACLEDA', 'Wing'].map((m) => (
                <span key={m} className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium text-white/70">{m}</span>
              ))}
            </div>
            <div className="text-[11px] text-white/40 mt-2">Upload payment screenshot, admin verifies within 5 minutes. Marked as Pending Verification until confirmed.</div>
          </div>
        </div>
      </div>

      <OrderModal product={product} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
