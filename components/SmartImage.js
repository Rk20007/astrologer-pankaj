'use client';

import { useState } from 'react';

/**
 * Renders an <img> that gracefully falls back to a placeholder when the
 * source file is missing (e.g. an image that hasn't been added yet).
 * Uses a plain <img> because next.config has images.unoptimized = true.
 */
export default function SmartImage({
  src,
  alt = '',
  className = '',
  fallback = '/placeholder.jpg',
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (imgSrc !== fallback) setImgSrc(fallback);
      }}
      className={className}
      {...props}
    />
  );
}
