'use client';

import Button from '@/components/Button';
import { useBookingModal } from '@/components/BookingModal';

/**
 * Opens the in-page booking modal for a specific service/consultant. Lets server
 * components (e.g. the pricing page) trigger the client-side booking flow without
 * navigating to the contact page.
 */
export default function BookNowButton({
  option,
  consultant,
  cardTitle,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}) {
  const { openBooking } = useBookingModal();
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => openBooking({ option, consultant, cardTitle })}
    >
      {children}
    </Button>
  );
}
