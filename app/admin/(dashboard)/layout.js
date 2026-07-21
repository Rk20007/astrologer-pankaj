import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import LogoutButton from '../_components/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-gray-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">✦</span>
            Content Admin
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/admin" className="rounded-lg px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
              Sections
            </Link>
            <Link href="/admin/images" className="rounded-lg px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
              Images
            </Link>
            <Link href="/" target="_blank" className="rounded-lg px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
              View Site ↗
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
