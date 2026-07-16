import { Zap, MapPin, CalendarClock } from 'lucide-react';
import { formatINR } from '@/data/site';

/**
 * Renders a service's fee: a flat price, or one row per region for Vastu.
 * Shared by ServiceCard and the home services panel so the two always agree.
 */
export default function ServicePrice({ service }) {
  return (
    <div className="space-y-2">
      {service.tiers
        ? service.tiers.map((tier) => (
            <div
              key={tier.label}
              className="flex items-center justify-between gap-3 rounded-lg border border-accent/40 bg-background p-2.5"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {tier.label}
              </span>
              <span className="text-right">
                <span className="block text-lg font-bold text-primary">
                  {tier.from && (
                    <span className="mr-1 text-[10px] font-semibold uppercase text-muted-foreground">
                      from
                    </span>
                  )}
                  {formatINR(tier.price)}
                </span>
                {tier.suffix && (
                  <span className="block text-[10px] text-muted-foreground">{tier.suffix}</span>
                )}
              </span>
            </div>
          ))
        : service.price != null && (
            <div className="flex items-center justify-between rounded-lg border border-accent/40 bg-background p-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Consultation Fee
              </span>
              <span className="text-lg font-bold text-primary">{formatINR(service.price)}</span>
            </div>
          )}

      {service.urgent && (
        <div className="flex items-center justify-between rounded-lg border border-secondary/20 bg-secondary/5 p-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-secondary">
            <Zap className="h-3.5 w-3.5" />
            Urgent {service.urgentNote ? `· ${service.urgentNote}` : ''}
          </span>
          <span className="text-lg font-bold text-secondary">{formatINR(service.urgent)}</span>
        </div>
      )}

      {service.waitingText && (
        <p className="inline-flex items-center gap-1.5 pt-0.5 text-xs text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5 text-primary" />
          {service.waitingText}
        </p>
      )}
    </div>
  );
}
