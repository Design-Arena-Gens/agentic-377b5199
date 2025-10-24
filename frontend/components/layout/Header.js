"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShoppingBagIcon, UserIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuthContext } from '../../context/AuthContext';
import { useCartContext } from '../../context/CartContext';
import CartDrawer from '../cart/CartDrawer';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/orders', label: 'Orders' }
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const { items } = useCartContext();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <button className="md:hidden" onClick={() => setMenuOpen(prev => !prev)}>
            <Bars3Icon className="h-6 w-6 text-secondary" />
          </button>
          <Link href="/" className="text-2xl font-bold text-primary">
            BlueCart
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-primary' : 'text-secondary hover:text-primary'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => logout()}
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 md:block"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push('/auth')}
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 md:block"
            >
              Sign In
            </button>
          )}

          <button onClick={() => router.push('/auth')} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-secondary md:hidden">
            <UserIcon className="h-5 w-5" />
          </button>

          <button onClick={() => setCartOpen(true)} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-secondary">
            <ShoppingBagIcon className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-gray-100 bg-white shadow-inner md:hidden">
          <div className="flex flex-col space-y-2 p-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${pathname === link.href ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-primary/10 hover:text-primary'}`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="rounded-md bg-primary px-3 py-2 text-left text-sm font-medium text-white"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push('/auth');
                  setMenuOpen(false);
                }}
                className="rounded-md bg-primary px-3 py-2 text-left text-sm font-medium text-white"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
      )}

      <CartDrawer open={isCartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
