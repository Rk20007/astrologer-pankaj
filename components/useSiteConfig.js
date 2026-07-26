'use client';

import { useEffect, useState } from 'react';
import { contacts as defaultContacts, normaliseContacts } from '@/data/site';
import { paymentConfig as defaultPayment } from '@/data/payment';

/**
 * The admin-editable WhatsApp lines and payment details, for client components
 * that render on static pages and so cannot read the database directly.
 *
 * It renders the bundled defaults immediately (no loading state, no layout
 * shift on the common path) and swaps in the live values once they arrive.
 * The request is cached at module scope, so the footer, the floating buttons
 * and the payment panel share a single fetch per page load.
 */
let cached = null;
let inflight = null;

function load() {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;

  inflight = fetch('/api/site-config')
    .then((r) => r.json())
    .then((data) => {
      if (!data?.ok) return null;
      cached = {
        payment: { ...defaultPayment, ...(data.payment || {}) },
        contacts: normaliseContacts(data.contacts),
      };
      return cached;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

const FALLBACK = { payment: defaultPayment, contacts: defaultContacts };

export function useSiteConfig() {
  const [config, setConfig] = useState(cached || FALLBACK);

  useEffect(() => {
    if (cached) {
      setConfig(cached);
      return;
    }
    let cancelled = false;
    load().then((next) => {
      if (!cancelled && next) setConfig(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}
