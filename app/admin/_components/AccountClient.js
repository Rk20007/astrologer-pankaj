'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, KeyRound, ShieldAlert, Eye, EyeOff } from 'lucide-react';

function PasswordInput({ id, label, value, onChange, autoComplete, hint }) {
  const [shown, setShown] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-amber-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          aria-label={shown ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
        >
          {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export default function AccountClient() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/account')
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) throw new Error(data.error || 'Could not load the account.');
        setAccount(data.account);
        setUsername(data.account.username);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/admin/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not save the new password.');
      setAccount(data.account);
      setUsername(data.account.username);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 py-10 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading account…
      </p>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Login &amp; password</h1>
      <p className="mt-0.5 mb-6 text-sm text-gray-500">
        Change the username and password used to sign in to this panel.
      </p>

      {account?.usingEnvPassword && (
        <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold">This panel still uses the password from the setup file.</p>
            <p className="mt-0.5 text-amber-800">
              Set your own password below. Once you do, the one in <code>.env.local</code> stops
              working and the password lives (hashed) in the database instead.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-5">
        <div>
          <label htmlFor="admin-username" className="mb-1 block text-sm font-semibold text-gray-700">
            Username
          </label>
          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <PasswordInput
          id="admin-current"
          label="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
          autoComplete="current-password"
          hint="Asked for even though you are signed in, so nobody can change it from a machine you left open."
        />

        <PasswordInput
          id="admin-new"
          label="New password"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
          hint="At least 10 characters, with a letter and a number."
        />

        <PasswordInput
          id="admin-confirm"
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
        )}

        {saved && (
          <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Password changed. Any other browser signed in to this panel has been logged out.
          </p>
        )}

        <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
          <button
            type="submit"
            disabled={saving || !currentPassword || !newPassword || !confirmPassword}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {saving ? 'Saving…' : 'Change password'}
          </button>
          {account?.updatedAt && !saved && (
            <span className="text-xs text-gray-400">
              Last changed{' '}
              {new Date(account.updatedAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </form>

      <p className="mt-4 text-xs text-gray-400">
        Forgotten the password entirely? Delete the <code>adminAccount</code> document from the
        <code> settings</code> collection in MongoDB — the login falls back to the username and
        password in <code>.env.local</code>.
      </p>
    </div>
  );
}
