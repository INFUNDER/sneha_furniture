'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
};

type ServerProduct = { id: string; title: string; price: number; discountPrice: number | null; stock: number };

const CartContext = createContext<CartContextType | undefined>(undefined);

const capQuantity = (quantity: number, stock?: number) =>
  stock === undefined ? quantity : Math.max(1, Math.min(quantity, stock));

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let stored: CartItem[] = [];
    try {
      stored = JSON.parse(localStorage.getItem('sneha-cart') || '[]');
    } catch {
      stored = [];
    }
    // localStorage is only readable after hydration, so the cart has to be loaded in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(stored);
    setIsLoaded(true);

    if (stored.length === 0) return;

    // Refresh prices and stock: the saved cart can be days old.
    fetch(`/api/products?ids=${stored.map((i) => encodeURIComponent(i.id)).join(',')}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { products: ServerProduct[] } | null) => {
        if (!data) return;
        const byId = new Map(data.products.map((p) => [p.id, p]));
        setItems((current) =>
          current.flatMap((item) => {
            const p = byId.get(item.id);
            if (!p || p.stock < 1) return [];
            return [{
              ...item,
              title: p.title,
              price: p.discountPrice ?? p.price,
              stock: p.stock,
              quantity: capQuantity(item.quantity, p.stock),
            }];
          })
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('sneha-cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((current) => {
      const existing = current.find(i => i.id === item.id);
      if (existing) {
        return current.map(i => i.id === item.id ? { ...i, ...item, quantity: capQuantity(i.quantity + quantity, item.stock) } : i);
      }
      return [...current, { ...item, quantity: capQuantity(quantity, item.stock) }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(current => current.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(current => current.map(i => i.id === id ? { ...i, quantity: capQuantity(quantity, i.stock) } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
