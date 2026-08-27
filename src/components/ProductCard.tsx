'use client';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Package, Zap, Crown } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

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

type Props = {
  product: Product;
  onBuy: (product: Product) => void;
  onView: (product: Product) => void;
};

export default function ProductCard({ product, onBuy, onView }: Props) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please login to save favorites', 'info');
      return;
    }
    setWishLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsWishlisted(!isWishlisted);
        showToast(data.message || (isWishlisted ? 'Removed from favorites' : 'Added to your favorites ❤️'), 'success');
      } else {
        showToast(data.error || 'Failed', 'error');
      }
    } catch {
      showToast('Error saving wishlist', 'error');
    } finally {
      setWishLoading(false);
    }
  };

  const isMinecraft = product.category === 'MINECRAFT';
  const inStock = product.stock > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group relative product-card glass rounded-[24px] border border-white/[0.08] overflow-hidden flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.02]">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl ${isMinecraft ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-violet-600 to-fuchsia-500'} shadow-xl`}>
              {isMinecraft ? '⛏️' : '⌨️'}
            </div>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border backdrop-blur-md ${isMinecraft ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200' : 'bg-violet-500/20 border-violet-400/30 text-violet-200'}`}>
              {isMinecraft ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {isMinecraft ? 'Minecraft' : 'Keyboard'}
            </span>
            {product.featured && (
              <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-amber-400 text-black shadow">
                🔥 Featured
              </span>
            )}
          </div>
          <button
            onClick={handleWishlist}
            disabled={wishLoading}
            className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${isWishlisted ? 'bg-pink-500 border-pink-400 text-white' : 'bg-black/30 border-white/15 text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Stock overlay */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md border ${inStock ? 'bg-emerald-500/15 border-emerald-400/20 text-emerald-200' : 'bg-red-500/15 border-red-400/20 text-red-200'}`}>
            <Package className="w-3 h-3" />
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-[15px] leading-tight text-white line-clamp-1 group-hover:text-violet-200 transition-colors">{product.name}</h3>
          <p className="text-[12.5px] leading-relaxed text-white/50 line-clamp-2 mt-1.5">{product.description}</p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="text-[20px] font-black tracking-tight text-white">{formatPrice(product.price)}</div>
            <div className="text-[11px] text-white/30 line-through hidden">~ ${(product.price * 1.3).toFixed(2)}</div>
          </div>

          <div className="grid grid-cols-[1.2fr_0.8fr] gap-2">
            <button
              onClick={() => onBuy(product)}
              disabled={!inStock}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white text-[13px] font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <ShoppingCart className="w-4 h-4" />
              Buy Now
            </button>
            <button
              onClick={() => onView(product)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-white/[0.06] border border-white/10 text-white/80 text-[13px] font-medium hover:bg-white/[0.1] hover:text-white transition"
            >
              <Eye className="w-4 h-4" />
              Details
            </button>
          </div>

          <button
            onClick={handleWishlist}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-white/[0.03] border border-dashed border-white/10 text-[12px] font-medium text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/[0.05] transition"
          >
            🤔 I&apos;ll think about it again
          </button>
        </div>
      </div>

      {/* Subtle glow on hover */}
      <div className="absolute -inset-[1px] rounded-[24px] bg-gradient-to-br from-violet-500/0 via-fuchsia-500/0 to-cyan-400/0 group-hover:from-violet-500/20 group-hover:via-fuchsia-500/10 group-hover:to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
    </motion.div>
  );
}
