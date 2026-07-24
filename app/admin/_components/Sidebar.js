'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  CalendarClock,
  FileText,
  ScrollText,
  ImageIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/leads', label: 'Leads & Bookings', icon: Inbox },
  { href: '/admin/kundali', label: 'Kundali PDF', icon: ScrollText },
  { href: '/admin/availability', label: 'Availability', icon: CalendarClock },
  { href: '/admin/content', label: 'Website Content', icon: FileText },
  { href: '/admin/images', label: 'Images', icon: ImageIcon },
];

function isActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="space-y-1 border-t border-gray-200 px-3 py-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
      >
        <ExternalLink className="h-[18px] w-[18px] shrink-0" />
        View Website
      </Link>
      <button
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        <LogOut className="h-[18px] w-[18px] shrink-0" />
        Log out
      </button>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 border-b border-gray-200 px-5 py-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-lg text-white">
        ✦
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold text-gray-900">Admin Panel</span>
        <span className="block text-[11px] text-gray-400">Bhawna Upadhyay</span>
      </span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">
            ✦
          </span>
          Admin Panel
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Desktop fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
        <Brand />
        <NavLinks pathname={pathname} />
        <SidebarFooter />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-gray-900/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 pr-3">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <SidebarFooter />
          </aside>
        </div>
      )}
    </>
  );
}
