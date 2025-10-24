"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('cart');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      if (existing) {
        return prev.map(item => item.product._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
        );
      }
      toast.success('Added to cart');
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = productId => {
    setItems(prev => prev.filter(item => item.product._id !== productId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    setItems(prev => prev.map(item => item.product._id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.07;
    const shipping = subtotal > 500 ? 0 : 15;
    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping
    };
  }, [items]);

  const value = useMemo(() => ({ items, totals, addItem, removeItem, updateQuantity, clearCart }), [items, totals]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return ctx;
};
