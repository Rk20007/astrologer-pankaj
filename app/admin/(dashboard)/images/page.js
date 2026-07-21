'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImagePicker from '../../_components/ImagePicker';

// Reuses the ImagePicker in management mode (no "Use" button, just upload/delete).
export default function ImagesPage() {
  // Keep the library mounted inline rather than as a modal.
  const [open] = useState(true);
  return (
    <div>
      <Link href="/admin" className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-800">
        ← All sections
      </Link>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Image Library</h1>
      <p className="mb-6 text-sm text-gray-500">
        Upload photos here, then pick them in any section’s image fields.
      </p>
      {open && <ImagePicker selectable={false} onClose={() => {}} />}
    </div>
  );
}
