import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { getUserId } from '@/lib/userSession';
import { listRequestsByUser } from '@/lib/kundali';
import { STATUS_LABEL, STATUS_STYLE } from '@/lib/kundaliStatusMeta';
import { FileText, Download, ArrowRight, ScrollText, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'My Kundali Requests' };

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLE[status] || 'bg-gray-100 text-gray-700'}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export default async function MyRequestsPage() {
  const uid = await getUserId();
  const requests = uid ? await listRequestsByUser(uid) : [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background pt-16">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                  <ScrollText className="h-3.5 w-3.5" /> My Requests
                </span>
                <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                  My Kundali Requests
                </h1>
              </div>
              <Link
                href="/kundali/book"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-all hover:bg-accent hover:text-foreground active:scale-95"
              >
                <Plus className="h-4 w-4" /> New Request
              </Link>
            </div>

            {requests.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-accent/50 bg-card p-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-accent" />
                <h2 className="font-serif text-2xl font-bold text-foreground">No requests yet</h2>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                  {uid
                    ? "You haven't requested a Kundali PDF yet."
                    : "We couldn't find any requests from this device. Requests are linked to the browser you booked from."}
                </p>
                <Link
                  href="/kundali/book"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-accent hover:text-foreground"
                >
                  Request a Kundali PDF <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent/60 sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-primary">{req.code}</span>
                          <StatusBadge status={req.status} />
                          {req.hasPdf && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800">
                              <FileText className="h-3 w-3" /> PDF Available
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 font-serif text-lg font-bold text-foreground">{req.service}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          Requested on {formatDate(req.createdAt)}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                        {req.hasPdf && (
                          <a
                            href={`/api/kundali/requests/${req.id}/pdf`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-all hover:bg-accent hover:text-foreground"
                          >
                            <Download className="h-4 w-4" /> Detailed Report
                          </a>
                        )}
                        <a
                          href={`/api/kundali/requests/${req.id}/summary`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-accent/60 bg-accent/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-accent/20"
                        >
                          <Download className="h-4 w-4" /> Summary PDF
                        </a>
                        <Link
                          href={`/kundali/requests/${req.id}`}
                          className="inline-flex items-center justify-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-primary"
                        >
                          View Details <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
