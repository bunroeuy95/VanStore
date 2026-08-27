'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { Save, Upload } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    storeName: '',
    telegramUsername: '',
    tiktokUsername: '',
    facebookUrl: '',
    abaAccount: '',
    acledaAccount: '',
    wingAccount: '',
    khqrInstructions: '',
    khqrImageUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetch('/api/settings').then(r => r.json()).then(d => {
        if (d.settings) setForm(d.settings);
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) showToast('Settings saved!', 'success');
    else showToast('Failed to save', 'error');
    setSaving(false);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) {
      setForm({ ...form, khqrImageUrl: data.url });
      showToast('KHQR uploaded', 'success');
    } else showToast(data.error || 'Upload failed', 'error');
    setUploading(false);
  };

  if (loading) return <div className="p-20 text-center text-white/50">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="mx-auto max-w-900px px-6 py-10">
      <h1 className="text-[26px] font-black text-white mb-2">Store Settings</h1>
      <p className="text-[13px] text-white/50 mb-8">Configure Telegram, TikTok, Facebook, payment info, store name. These use env variables: TELEGRAM_ADMIN_USERNAME, TIKTOK_USERNAME, FACEBOOK_PAGE_URL</p>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-strong rounded-[20px] border border-white/10 p-6 space-y-4">
          <h3 className="font-bold text-white">General</h3>
          <div>
            <label className="text-[11px] font-bold tracking-widest uppercase text-white/50">Store Name</label>
            <input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/0.06 border border-white/10 text-white text-[13px] focus:outline-none focus:border-violet-500/40" />
          </div>
        </div>

        <div className="glass-strong rounded-[20px] border border-white/10 p-6 space-y-4">
          <h3 className="font-bold text-white">Social Links (Telegram is critical for Buy Now flow)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold tracking-widest uppercase text-white/50">Telegram Username (TELEGRAM_ADMIN_USERNAME)</label>
              <input value={form.telegramUsername} onChange={(e) => setForm({ ...form, telegramUsername: e.target.value })} placeholder="your_admin" className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/0.06 border border-white/10 text-white text-[13px] focus:outline-none" />
              <div className="text-[11px] text-white/30 mt-1">Used for Buy Now → Telegram. Do not hardcode elsewhere, use config file.</div>
            </div>
            <div>
              <label className="text-[11px] font-bold tracking-widest uppercase text-white/50">TikTok Username (TIKTOK_USERNAME)</label>
              <input value={form.tiktokUsername} onChange={(e) => setForm({ ...form, tiktokUsername: e.target.value })} placeholder="your_tiktok" className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/0.06 border border-white/10 text-white text-[13px] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold tracking-widest uppercase text-white/50">Facebook Page URL (FACEBOOK_PAGE_URL)</label>
            <input value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} placeholder="https://facebook.com/..." className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/0.06 border border-white/10 text-white text-[13px] focus:outline-none" />
          </div>
        </div>

        <div className="glass-strong rounded-[20px] border border-white/10 p-6 space-y-4">
          <h3 className="font-bold text-white">Payment Configuration (Cambodia)</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className="text-[11px] font-bold tracking-widest uppercase text-white/50">ABA Account</label><input value={form.abaAccount} onChange={(e) => setForm({ ...form, abaAccount: e.target.value })} className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/0.06 border border-white/10 text-white text-[13px] focus:outline-none" /></div>
            <div><label className="text-[11px] font-bold tracking-widest uppercase text-white/50">ACLEDA Account</label><input value={form.acledaAccount} onChange={(e) => setForm({ ...form, acledaAccount: e.target.value })} className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/0.06 border border-white/10 text-white text-[13px] focus:outline-none" /></div>
            <div><label className="text-[11px] font-bold tracking-widest uppercase text-white/50">Wing Account</label><input value={form.wingAccount} onChange={(e) => setForm({ ...form, wingAccount: e.target.value })} className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/0.06 border border-white/10 text-white text-[13px] focus:outline-none" /></div>
          </div>
          <div>
            <label className="text-[11px] font-bold tracking-widest uppercase text-white/50">KHQR Instructions</label>
            <textarea value={form.khqrInstructions} onChange={(e) => setForm({ ...form, khqrInstructions: e.target.value })} rows={3} className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/0.06 border border-white/10 text-white text-[13px] focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-[11px] font-bold tracking-widest uppercase text-white/50">KHQR Image</label>
            <div className="mt-2 flex gap-2">
              <input value={form.khqrImageUrl} onChange={(e) => setForm({ ...form, khqrImageUrl: e.target.value })} placeholder="/uploads/khqr.jpg or URL" className="flex-1 px-4 py-3 rounded-2xl bg-white/0.06 border border-white/10 text-white text-[13px] focus:outline-none" />
              <label className="px-4 py-3 rounded-2xl bg-white/0.06 border border-white/10 text-white/70 text-[13px] flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4" /> {uploading ? '...' : 'Upload'}<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} /></label>
            </div>
            {form.khqrImageUrl && <div className="mt-3 w-48 h-48 rounded-xl overflow-hidden bg-white/0.04 border border-white/10"><img src={form.khqrImageUrl} alt="KHQR" className="w-full h-full object-cover" /></div>}
            <div className="text-[11px] text-amber-200/60 mt-2">⚠️ Do not mark payment successful based only on screenshot. Mark as Pending Verification until admin verifies.</div>
          </div>
        </div>

        <button disabled={saving} className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full 'bg-gradient-to-br' from-violet-600 to-fuchsia-500 text-white font-semibold text-[14px] shadow-lg shadow-violet-500/20 disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}</button>
      </form>
    </div>
  );
}
