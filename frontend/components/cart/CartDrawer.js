"use client";

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';
import { useCartContext } from '../../context/CartContext';

export default function CartDrawer({ open, onClose }) {
  const { items, totals, removeItem } = useCartContext();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 flex justify-end">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="flex h-full w-full max-w-md flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 p-6">
                <Dialog.Title className="text-lg font-semibold text-text">Your Cart</Dialog.Title>
                <button onClick={onClose} className="text-sm font-semibold text-secondary">Close</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <p className="text-secondary">Your cart is empty.</p>
                ) : (
                  <ul className="space-y-4">
                    {items.map(item => (
                      <li key={item.product._id} className="rounded-2xl bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-text">{item.product.title}</p>
                            <p className="text-xs text-secondary">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-text">${(item.product.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => removeItem(item.product._id)} className="text-xs font-semibold text-error">
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="border-t border-gray-100 p-6">
                <div className="flex items-center justify-between text-sm text-secondary">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <Link href="/checkout" onClick={onClose} className="mt-4 flex w-full justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
                  Proceed to Checkout
                </Link>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
