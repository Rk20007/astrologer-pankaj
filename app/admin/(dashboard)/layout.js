import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Sidebar from '../_components/Sidebar';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="md:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
