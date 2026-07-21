'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { socialLinks } from '@/data/navigation';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from '@/components/SocialIcons';

const socialIcons = {
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

// Brand colours so each icon reads at a glance, like the reference layout.
const brandColor = {
  youtube: '#FF0000',
  instagram: '#E1306C',
  facebook: '#1877F2',
};

/**
 * A vertical strip of social icons pinned to the right edge of the viewport.
 * It stays in the same spot while the page scrolls (position: fixed).
 */
export default function FloatingSocial() {
  const pathname = usePathname();
  // Keep the admin panel clean.
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
      {socialLinks.map((social, idx) => {
        const Icon = socialIcons[social.platform];
        return (
          <motion.a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            initial={{ opacity: 0, x: 30 }}
            animate={{
              opacity: 1,
              x: 0,
              // Gentle up-and-down float that never stops, staggered per icon.
              y: [0, -6, 0],
            }}
            transition={{
              opacity: { delay: 0.4 + idx * 0.12, duration: 0.4, ease: 'easeOut' },
              x: { delay: 0.4 + idx * 0.12, duration: 0.4, ease: 'easeOut' },
              y: {
                delay: 0.4 + idx * 0.12,
                duration: 2.4,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
              },
            }}
            whileHover={{ scale: 1.2, x: -4 }}
            whileTap={{ scale: 0.95 }}
            style={{ backgroundColor: brandColor[social.platform] }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg ring-1 ring-white/20 transition-shadow hover:shadow-xl"
          >
            {Icon ? <Icon className="h-5 w-5" /> : social.label[0]}
          </motion.a>
        );
      })}
    </div>
  );
}
