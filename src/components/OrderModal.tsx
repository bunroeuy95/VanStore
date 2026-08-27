'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Copy, Check, Shield, Package, User, CreditCard, Image as ImageIcon, Upload } from 'lucide-react';
import { formatPrice, generateTelegramOrderMessage } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getTelegramLink } from '@/lib/config';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
};

type Props = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  orderId?: string;
};

type StoreSettings = {
  khqrImageUrl?: string | null;
};

export default function OrderModal({ product, open, onClose, orderId }: Props) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('KHQR');
  const [creating, setCreating] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{ orderCode: string; id: string; uploadToken: string } | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [paymentDeadline, setPaymentDeadline] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [uploadingProof, setUploadingProof] = useState(false);
  const [sendingProof, setSendingProof] = useState(false);
  const [paymentProofUploaded, setPaymentProofUploaded] = useState(false);

  useEffect(() => {
    if (!showPayment || settings) return;
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data.settings || null))
      .catch(() => setSettings(null));
  }, [showPayment, settings]);

  useEffect(() => {
    if (!paymentDeadline) return;
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentDeadline]);

  const paymentTimeLeft = paymentDeadline
    ? Math.max(Math.ceil((paymentDeadline - currentTime) / 1000), 0)
    : 0;

  if (!product) return null;

  const finalOrderId = createdOrder?.orderCode || orderId || `#MC${Math.floor(1000 + Math.random() * 9000)}`;
  const displayName = user?.name || customerName || 'Guest Customer';

  const telegramMessage = generateTelegramOrderMessage({
    productName: product.name,
    price: product.price,
    orderId: finalOrderId,
    customerName: displayName,
    productImage: product.imageUrl || undefined,
  });

  const telegramLink = getTelegramLink(telegramMessage);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(telegramMessage);
    setCopied(true);
    showToast('Order message copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateOrder = async () => {
    if (!customerName && !user) {
      showToast('Please enter your name', 'error');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: displayName,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedOrder({
          orderCode: data.order.orderCode,
          id: data.order.id,
          uploadToken: data.order.uploadToken,
        });
        setPaymentDeadline(Date.now() + 5 * 60 * 1000);
        setPaymentProofUploaded(false);
        setShowPayment(true);
        showToast('Order created! Now contact admin on Telegram', 'success');
      } else {
        showToast(data.error || 'Failed to create order', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleProofUpload = async (file: File) => {
    if (!createdOrder) return;
    setUploadingProof(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('orderId', createdOrder.id);
      formData.append('uploadToken', createdOrder.uploadToken);
      const uploadResponse = await fetch('/api/payment-proof', { method: 'POST', body: formData });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadData.error || 'Upload failed');
      setPaymentProofUploaded(true);
      showToast('Payment photo saved for admin verification', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Upload failed', 'error');
    } finally {
      setUploadingProof(false);
    }
  };

  const handleTelegramChat = async () => {
    if (!createdOrder) return;
    if (!paymentProofUploaded) {
      showToast('Upload your payment photo first', 'error');
      return;
    }
    const telegramWindow = window.open('', '_blank');
    setSendingProof(true);
    try {
      const response = await fetch('/api/payment-proof/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: createdOrder.id, uploadToken: createdOrder.uploadToken }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not send payment photo');
      showToast(data.partial ? 'Sent to Telegram admin; group delivery failed' : 'Payment photo sent to Telegram', data.partial ? 'error' : 'success');
      if (telegramWindow) telegramWindow.location.href = telegramLink;
    } catch (error) {
      telegramWindow?.close();
      showToast(error instanceof Error ? error.message : 'Could not send payment photo', 'error');
    } finally {
      setSendingProof(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[520px] max-h-[90vh] overflow-hidden glass-strong rounded-[28px] border border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 pb-4 flex items-start justify-between gap-4 border-b border-white/5">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/[0.06] border border-white/10 shrink-0">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🎮</div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-white leading-tight">{product.name}</h3>
                  <div className="text-[13px] text-white/50 mt-1">Order ID: <span className="font-mono font-bold text-white">{finalOrderId}</span></div>
                  <div className="text-[18px] font-black text-white mt-1">{formatPrice(product.price)}</div>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              {!user && !createdOrder && (
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold tracking-widest uppercase text-white/50 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Your Name
                  </label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name / username"
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08] transition"
                  />
                </div>
              )}

              {createdOrder && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-[13px] text-emerald-200">
                  <Shield className="w-4 h-4" /> Order {createdOrder.orderCode} created successfully!
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[12px] font-semibold tracking-widest uppercase text-white/50 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5" /> Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['KHQR', 'ABA', 'ACLEDA', 'Wing'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-2xl border text-[13px] font-medium transition flex items-center justify-center gap-2 ${paymentMethod === method ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-white/[0.04] border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white'}`}
                    >
                      {method === 'KHQR' ? 'KHQR' : method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-semibold tracking-widest uppercase text-white/50 flex items-center gap-2">
                    <Send className="w-3.5 h-3.5" /> Telegram Message (Auto-generated)
                  </label>
                  <button onClick={handleCopy} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-medium text-white/70 hover:text-white transition">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-[12.5px] leading-relaxed text-white/80 whitespace-pre-wrap">
                  {telegramMessage}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-white/40">
                  <ImageIcon className="w-3 h-3" /> After opening Telegram, please also send the product image from this page
                </div>
              </div>

              {showPayment && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-600/15 to-fuchsia-500/15 border border-violet-500/20 space-y-3">
                  <div className="text-[13px] font-semibold text-white flex items-center gap-2">
                    <Package className="w-4 h-4" /> Payment Instructions
                  </div>
                  <div className="text-[12.5px] leading-relaxed text-white/70">
                    {paymentMethod === 'KHQR'
                      ? 'ស្កេន KHQR ខាងក្រោម។ បន្ទាប់ពីបង់ប្រាក់រួច សូមបង្ហោះរូបថតអេក្រង់នៅក្នុងប្រវត្តិរូប។'
                      : `ជ្រើសរើស ${paymentMethod} នៅក្នុងកម្មវិធីធនាគាររបស់អ្នក បន្ទាប់មកស្កេន KHQR ខាងក្រោម។ បន្ទាប់ពីបង់ប្រាក់រួច សូមបង្ហោះរូបថតអេក្រង់នៅក្នុងប្រវត្តិរូប។`}
                  </div>
                  {settings?.khqrImageUrl && (
                    <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/10 bg-white p-3">
                      <img src={settings.khqrImageUrl} alt="KHQR payment code" className="block aspect-square w-full object-contain" />
                    </div>
                  )}
                  <div className={`rounded-xl border p-3 text-center text-[12px] font-semibold ${paymentTimeLeft > 0 ? 'border-violet-400/20 bg-violet-500/10 text-violet-200' : 'border-red-400/20 bg-red-500/10 text-red-200'}`}>
                    {paymentTimeLeft > 0
                      ? `Complete payment within ${Math.floor(paymentTimeLeft / 60)}:${String(paymentTimeLeft % 60).padStart(2, '0')}`
                      : 'Payment time expired. Please contact admin before paying.'}
                  </div>
                  <div className="text-[11px] text-amber-200/80 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5">
                    ⚠️ Do not claim payment successful from screenshot alone. Admin will verify.
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 pt-4 border-t border-white/5 bg-black/20 flex gap-3">
              {!createdOrder ? (
                <button
                  onClick={handleCreateOrder}
                  disabled={creating}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white font-semibold text-[14px] shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 disabled:opacity-50 transition"
                >
                  {creating ? 'Creating...' : 'Create Order & Continue'}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleTelegramChat}
                    disabled={!paymentProofUploaded || sendingProof}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#229ED9] text-white font-semibold text-[14px] shadow-lg shadow-[#229ED9]/20 hover:bg-[#1c8bc0] transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none"
                  >
                    <Send className="w-4 h-4" />
                    {sendingProof ? 'Sending photo...' : 'Chat on Telegram'}
                  </button>
                  <label className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-white/[0.06] border border-white/10 text-white font-medium text-[14px] hover:bg-white/[0.1] transition cursor-pointer">
                    <Upload className="w-4 h-4" />
                    {uploadingProof ? 'Uploading...' : 'Upload Photo'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="hidden"
                      disabled={uploadingProof}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) handleProofUpload(file);
                        event.target.value = '';
                      }}
                    />
                  </label>
                  <button onClick={onClose} className="px-6 py-3.5 rounded-full bg-white/[0.06] border border-white/10 text-white font-medium text-[14px] hover:bg-white/[0.08] transition">
                    Close
                  </button>
                </>
              )}
            </div>

            <div className="px-6 pb-4 text-center text-[11px] text-white/30">
              Product → Buy Now → Order Details → Payment → Telegram Admin • No manual typing needed ✨
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
