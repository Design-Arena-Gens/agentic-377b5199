import Link from 'next/link';

const footerLinks = {
  Company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ],
  Support: [
    { href: '/faq', label: 'FAQ' },
    { href: '/shipping', label: 'Shipping' }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h4 className="text-lg font-bold">BlueCart</h4>
            <p className="mt-3 text-sm text-gray-300">
              Discover the latest products curated for modern lifestyles.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h5 className="text-sm font-semibold uppercase text-gray-200">{title}</h5>
              <ul className="mt-4 space-y-2 text-sm text-gray-400">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h5 className="text-sm font-semibold uppercase text-gray-200">Newsletter</h5>
            <p className="mt-4 text-sm text-gray-400">Subscribe for updates on new arrivals and offers.</p>
            <form className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-md bg-white/10 px-3 py-2 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-gray-400">
          © {new Date().getFullYear()} BlueCart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
