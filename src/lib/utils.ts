export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateTelegramOrderMessage(data: {
  productName: string;
  price: number;
  orderId: string;
  customerName: string;
  productImage?: string;
}): string {
  const productImage = data.productImage
    ? typeof window !== 'undefined'
      ? new URL(data.productImage, window.location.origin).href
      : data.productImage
    : null;

  return `🛒 NEW ORDER

Product: ${data.productName}
Price: $${data.price}
Order ID: ${data.orderId}
Customer: ${data.customerName}
${productImage ? `Product image: ${productImage}\n` : ''}

Please confirm my order. 🎮`;
}
