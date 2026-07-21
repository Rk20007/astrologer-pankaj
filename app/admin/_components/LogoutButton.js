'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="rounded-lg px-3 py-1.5 font-medium text-red-600 hover:bg-red-50"
    >
      Log out
    </button>
  );
}
