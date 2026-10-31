import { prisma } from '@/lib/prisma';

export type ShippingAddress = {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
};

export class OrderError extends Error {}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function parseAddress(raw: unknown): ShippingAddress {
  const a = (raw ?? {}) as Record<string, unknown>;
  const address = {
    name: str(a.name, 100),
    phone: str(a.phone, 20).replace(/[\s-]/g, ''),
    street: str(a.street, 300),
    city: str(a.city, 100),
    state: str(a.state, 100),
    pincode: str(a.pincode, 10),
  };
  if (!address.name || !address.street || !address.city || !address.state) {
    throw new OrderError('Please fill in all shipping details');
  }
  if (!/^(\+?91)?[6-9]\d{9}$/.test(address.phone)) {
    throw new OrderError('Please enter a valid 10-digit Indian mobile number');
  }
  if (!/^[1-9]\d{5}$/.test(address.pincode)) {
    throw new OrderError('Please enter a valid 6-digit pincode');
  }
  return address;
}

export function parseItems(raw: unknown): { id: string; quantity: number }[] {
  if (!Array.isArray(raw) || raw.length === 0) throw new OrderError('Cart is empty');
  const merged = new Map<string, number>();
  for (const item of raw) {
    const id = typeof item?.id === 'string' ? item.id : '';
    const quantity = Number(item?.quantity);
    if (!id || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      throw new OrderError('Invalid cart item');
    }
    merged.set(id, (merged.get(id) ?? 0) + quantity);
  }
  return [...merged].map(([id, quantity]) => ({ id, quantity }));
}

// Creates an order using prices and stock from the database (never from the client)
// and reserves stock atomically so two buyers cannot oversell the last item.
export async function createOrder(params: {
  userId: string;
  items: { id: string; quantity: number }[];
  address: ShippingAddress;
  paymentMethod: 'COD' | 'RAZORPAY';
}) {
  return prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({ where: { id: { in: params.items.map((i) => i.id) } } });
    const byId = new Map(products.map((p) => [p.id, p]));

    let total = 0;
    const lines = params.items.map((item) => {
      const product = byId.get(item.id);
      if (!product) throw new OrderError('A product in your cart is no longer available');
      const unitPrice = product.discountPrice ?? product.price;
      total += unitPrice * item.quantity;
      return { productId: product.id, title: product.title, quantity: item.quantity, price: unitPrice };
    });

    for (const line of lines) {
      const updated = await tx.product.updateMany({
        where: { id: line.productId, stock: { gte: line.quantity } },
        data: { stock: { decrement: line.quantity } },
      });
      if (updated.count === 0) {
        throw new OrderError(`Sorry, "${line.title}" does not have enough stock for this quantity`);
      }
    }

    return tx.order.create({
      data: {
        userId: params.userId,
        totalAmount: total,
        paymentMethod: params.paymentMethod,
        paymentStatus: params.paymentMethod === 'COD' ? 'COD' : 'PENDING',
        shippingAddress: JSON.stringify(params.address),
        orderStatus: 'PENDING',
        items: {
          create: lines.map(({ productId, quantity, price }) => ({ productId, quantity, price })),
        },
      },
      include: { items: true },
    });
  });
}

// Puts reserved stock back, e.g. when an order is cancelled or a payment is abandoned.
export async function restoreStock(orderId: string) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  await prisma.$transaction(
    items.map((item) =>
      prisma.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })
    )
  );
}
