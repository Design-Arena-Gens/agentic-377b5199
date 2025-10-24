import Link from 'next/link';
import { CubeIcon, ShoppingCartIcon, UserGroupIcon, TagIcon } from '@heroicons/react/24/outline';

const links = [
  { href: '/dashboard', label: 'Overview', icon: CubeIcon },
  { href: '/dashboard/products', label: 'Products', icon: TagIcon },
  { href: '/dashboard/categories', label: 'Categories', icon: CubeIcon },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCartIcon },
  { href: '/dashboard/users', label: 'Users', icon: UserGroupIcon }
];

export default function AdminSidebar({ activePath }) {
  return (
    <aside className="hidden w-64 flex-shrink-0 rounded-3xl bg-white p-6 shadow lg:block">
      <h2 className="text-lg font-semibold text-text">Management</h2>
      <nav className="mt-6 space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = activePath.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? 'bg-primary text-white shadow' : 'text-secondary hover:bg-primary/10 hover:text-primary'}`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
