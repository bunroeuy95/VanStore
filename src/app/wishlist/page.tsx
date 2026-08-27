'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import OrderModal from '@/components/OrderModal';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/wishlist').then(r => r.json()).then(d => {
      setItems(d.wishlist || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleBuy = (product: any) => { setSelected(product); setModalOpen(true); };
  const handleView = (product: any) => { window.location.href = `/product/${product.id}`; };

  if (loading) return <div className="p-20 text-center text-white/50">Loading your favorites...</div>;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center"><Heart className="w-5 h-5 text-white fill-white" /></div>
        <div>
          <h1 className="text-[28px] font-black tracking-tight text-white">Your Favorites ❤️</h1>
          <p className="text-[13px] text-white/50">Products you thought about again</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-3xl mb-4">💔</div>
          <h3 className="font-bold text-white">No favorites yet</h3>
          <p className="text-[13px] text-white/50 mt-1">Click 🤔 I&apos;ll think about it again on any product</p>
          <Link href="/" className="inline-flex mt-4 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-[13px]">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((w) => (
            <ProductCard key={w.id} product={w.product} onBuy={handleBuy} onView={handleView} />
          ))}
        </div>
      )}

      <OrderModal product={selected} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
