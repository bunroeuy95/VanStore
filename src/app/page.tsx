'use client';
import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import PromoBanner from '@/components/PromoBanner';
import ProductCard from '@/components/ProductCard';
import OrderModal from '@/components/OrderModal';
import { Search, SlidersHorizontal, Gamepad2, Keyboard, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    // Auto seed if empty
    fetch('/api/seed', { method: 'POST' }).then(() => fetchProducts());
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
      setFiltered(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...products];
    if (category !== 'ALL') result = result.filter(p => p.category === category);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    if (sort === 'price_asc') result.sort((a,b) => a.price - b.price);
    if (sort === 'price_desc') result.sort((a,b) => b.price - a.price);
    if (sort === 'newest') result.sort((a,b) => 0); // already newest
    setFiltered(result);
  }, [search, category, sort, products]);

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setOrderModalOpen(true);
  };

  const handleView = (product: Product) => {
    window.location.href = `/product/${product.id}`;
  };

  const minecraftProducts = filtered.filter(p => p.category === 'MINECRAFT');
  const keyboardProducts = filtered.filter(p => p.category === 'KEYBOARD');

  return (
    <div className="min-h-screen">
      <PromoBanner />
      <Hero />

      {/* Trust badges */}
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: ShieldCheck, title: 'Secure Orders', desc: 'Escrow & verified' },
            { icon: Truck, title: 'Instant Delivery', desc: '< 5 min avg' },
            { icon: Clock, title: '24/7 Support', desc: 'Telegram fast reply' },
            { icon: Sparkles, title: 'Premium Quality', desc: 'Full access guarantee' },
          ].map((item) => (
            <div key={item.title} className="glass rounded-2xl p-4 border border-white/[0.06] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-violet-300" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white">{item.title}</div>
                <div className="text-[11px] text-white/50">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[68px] z-20 backdrop-blur-xl bg-[#070a14]/80 border-y border-white/[0.06] py-4">
        <div className="mx-auto max-w-[1280px] px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-[320px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Minecraft, keyboards..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/[0.06] border border-white/10 text-[13.5px] text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.08] transition"
              />
            </div>
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
              {[
                { id: 'ALL', label: 'All', icon: Sparkles },
                { id: 'MINECRAFT', label: 'Minecraft', icon: Gamepad2 },
                { id: 'KEYBOARD', label: 'Keyboards', icon: Keyboard },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-[12.5px] font-medium flex items-center gap-1.5 transition ${category === cat.id ? 'bg-white text-black shadow' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                >
                  <cat.icon className="w-3.5 h-3.5" /> {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-white/40" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-full bg-white/[0.06] border border-white/10 text-[12.5px] text-white/80 focus:outline-none"
            >
              <option value="newest" className="bg-[#0f1220]">Newest</option>
              <option value="price_asc" className="bg-[#0f1220]">Price: Low to High</option>
              <option value="price_desc" className="bg-[#0f1220]">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-[1280px] px-6 py-10 space-y-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass rounded-[24px] border border-white/5 overflow-hidden">
                <div className="aspect-[4/3] skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-4 skeleton rounded-full" />
                  <div className="h-3 skeleton rounded-full w-3/4" />
                  <div className="h-10 skeleton rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {(category === 'ALL' || category === 'MINECRAFT') && minecraftProducts.length > 0 && (
              <section id="minecraft" className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-[26px] md:text-[30px] font-black tracking-tight text-white flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[20px]">⛏️</span>
                      Minecraft Accounts
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-[11px] font-bold tracking-widest text-emerald-300 uppercase">Premium</span>
                    </h2>
                    <p className="text-[13.5px] text-white/50 mt-2">Full access, secure, instant delivery • Trusted by pros</p>
                  </div>
                  <Link href="#minecraft" className="hidden md:inline-flex text-[13px] text-white/50 hover:text-white transition">View all →</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {minecraftProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onBuy={handleBuy} onView={handleView} />
                  ))}
                </div>
              </section>
            )}

            {(category === 'ALL' || category === 'KEYBOARD') && keyboardProducts.length > 0 && (
              <section id="keyboards" className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-[26px] md:text-[30px] font-black tracking-tight text-white flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-[20px]">⌨️</span>
                      Gaming Keyboards
                      <span className="px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/20 text-[11px] font-bold tracking-widest text-violet-300 uppercase">Pro Grade</span>
                    </h2>
                    <p className="text-[13.5px] text-white/50 mt-2">Mechanical, RGB, wireless • Built for ROEUY MC</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {keyboardProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onBuy={handleBuy} onView={handleView} />
                  ))}
                </div>
              </section>
            )}

            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-3xl mb-4">🔍</div>
                <h3 className="text-[18px] font-bold text-white">No products found</h3>
                <p className="text-[13.5px] text-white/50 mt-1">Try adjusting search or category</p>
                <button onClick={() => { setSearch(''); setCategory('ALL'); }} className="mt-4 px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold">Clear filters</button>
              </div>
            )}
          </>
        )}

        {/* Contact CTA */}
        <section className="relative overflow-hidden rounded-[32px] glass-strong border border-white/10 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-fuchsia-500/10 to-cyan-400/10" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-[28px] md:text-[32px] font-black tracking-tight text-white leading-[1.1]">Need help choosing? <br /><span className="text-gradient">We got you.</span></h3>
              <p className="text-[14px] leading-relaxed text-white/60 mt-3 max-w-[420px]">Our team is online 24/7 on Telegram. Get instant advice on accounts, keyboards, and payment (KHQR, ABA, ACLEDA, Wing).</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link href="/contact" className="px-6 py-3 rounded-full bg-white text-black font-semibold text-[13.5px] hover:bg-white/90 transition">Contact us</Link>
                <Link href="/help" className="px-6 py-3 rounded-full bg-white/[0.08] border border-white/10 text-white font-medium text-[13.5px] hover:bg-white/[0.12] transition">How it works</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Avg. response', value: '< 5 min' },
                { label: 'Happy customers', value: '5,000+' },
                { label: 'Success rate', value: '99.9%' },
                { label: 'Rating', value: '4.9/5 ★' },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-4 border border-white/5">
                  <div className="text-[22px] font-black text-white">{stat.value}</div>
                  <div className="text-[11px] tracking-widest uppercase text-white/40 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <OrderModal product={selectedProduct} open={orderModalOpen} onClose={() => setOrderModalOpen(false)} />

      {/* Back to top */}
      <button id="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-24 right-6 w-10 h-10 rounded-full glass-strong border border-white/10 flex items-center justify-center text-white/70 hover:text-white opacity-0 transition-opacity z-30">
        ↑
      </button>
    </div>
  );
}
