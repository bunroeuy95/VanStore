'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { Plus, Edit, Trash2, Upload, X, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  stock: number;
  featured: boolean;
};

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', category: 'MINECRAFT', description: '', price: '', stock: '', featured: false, imageUrl: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => { if (user?.role === 'ADMIN') fetchProducts(); }, [user]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data.products || []);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) {
      setForm({ ...form, imageUrl: data.url });
      showToast('Image uploaded!', 'success');
    } else {
      showToast(data.error || 'Upload failed', 'error');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/products/${editing.id}` : '/api/products';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }) });
    const data = await res.json();
    if (res.ok) {
      showToast(editing ? 'Product updated' : 'Product created', 'success');
      setShowModal(false);
      setEditing(null);
      setForm({ name: '', category: 'MINECRAFT', description: '', price: '', stock: '', featured: false, imageUrl: '' });
      fetchProducts();
    } else {
      showToast(data.error || 'Failed', 'error');
    }
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, description: p.description, price: String(p.price), stock: String(p.stock), featured: p.featured, imageUrl: p.imageUrl || '' });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) { showToast('Deleted', 'success'); fetchProducts(); } else showToast('Failed to delete', 'error');
  };

  const handleResetStock = async (product: Product) => {
    if (!confirm(`Reset stock for ${product.name} to 0?`)) return;
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: 0 }),
    });
    if (res.ok) { showToast('Stock reset to 0', 'success'); fetchProducts(); } else showToast('Failed to reset stock', 'error');
  };

  if (loading) return <div className="p-20 text-center text-white/50">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[26px] font-black text-white">Products Management</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', category: 'MINECRAFT', description: '', price: '', stock: '', featured: false, imageUrl: '' }); setShowModal(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-[13px]"><Plus className="w-4 h-4" /> Add Product</button>
      </div>

      <div className="glass-strong rounded-[20px] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-white/[0.04] border-b border-white/5 text-[11px] tracking-widest uppercase text-white/40">
              <tr><th className="text-left p-4">Product</th><th className="text-left p-4">Category</th><th className="text-left p-4">Price</th><th className="text-left p-4">Stock</th><th className="text-left p-4">Featured</th><th className="text-right p-4">Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/[0.06] border border-white/10 shrink-0">
                      {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🎮</div>}
                    </div>
                    <div><div className="font-medium text-white">{p.name}</div><div className="text-[11px] text-white/40 truncate max-w-[200px]">{p.description}</div></div>
                  </td>
                  <td className="p-4"><span className="px-2 py-1 rounded-full bg-white/10 text-[11px] text-white/70">{p.category}</span></td>
                  <td className="p-4 font-bold text-white">{formatPrice(p.price)}</td>
                  <td className="p-4 text-white/70">{p.stock}</td>
                  <td className="p-4">{p.featured ? '⭐' : '-'}</td>
                  <td className="p-4 text-right"><div className="inline-flex gap-1"><button onClick={() => handleEdit(p)} title="Edit product" aria-label={`Edit ${p.name}`} className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60 hover:text-white"><Edit className="w-4 h-4" /></button><button onClick={() => handleResetStock(p)} title="Reset stock to 0" aria-label={`Reset ${p.name} stock to 0`} className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 hover:text-amber-200"><RotateCcw className="w-4 h-4" /></button><button onClick={() => handleDelete(p.id)} title="Delete product" aria-label={`Delete ${p.name}`} className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-300 hover:text-red-200"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={() => setShowModal(false)} />
          <form onSubmit={handleSubmit} className="relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto glass-strong rounded-[24px] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between"><h3 className="font-bold text-white">{editing ? 'Edit Product' : 'Add Product'}</h3><button type="button" onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60"><X className="w-4 h-4" /></button></div>

            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Product name" className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[13px] focus:outline-none focus:border-violet-500/40" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-[13px] focus:outline-none"><option value="MINECRAFT" className="bg-[#0f1220]">Minecraft</option><option value="KEYBOARD" className="bg-[#0f1220]">Keyboard</option></select>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required type="number" step="0.01" placeholder="Price" className="px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[13px] focus:outline-none" />
              </div>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Description" rows={3} className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[13px] focus:outline-none resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} type="number" placeholder="Stock" className="px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[13px] focus:outline-none" />
                <label className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-[13px] text-white/70"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-widest uppercase text-white/50">Product Image</label>
                <div className="flex gap-2">
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Image URL or upload" className="flex-1 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[13px] focus:outline-none" />
                  <label className="px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white/70 text-[13px] flex items-center gap-2 cursor-pointer hover:bg-white/[0.1]"><Upload className="w-4 h-4" /> {uploading ? '...' : 'Upload'}<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} /></label>
                </div>
                {form.imageUrl && <div className="w-full h-32 rounded-xl overflow-hidden bg-white/[0.04] border border-white/10"><img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" /></div>}
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white font-semibold text-[14px]">Save Product</button>
          </form>
        </div>
      )}
    </div>
  );
}
