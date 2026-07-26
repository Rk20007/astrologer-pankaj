import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { getUserId } from '@/lib/userSession';
import { getRequestForUser, getStatusLogs } from '@/lib/kundali';
import { listPaymentsForRef } from '@/lib/payments';
import { STATUS_LABEL, STATUS_STYLE } from '@/lib/kundaliStatusMeta';
import { PAYMENT_STATUS_LABEL, PAYMENT_STATUS_STYLE } from '@/lib/paymentMeta';
import { ArrowLeft, Download, FileText, CheckCircle2, Clock, IndianRupee } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

export default async function RequestDetailPage({ params }) {
  const { id } = await params;
  const uid = await getUserId();
  const req = uid ? await getRequestForUser(id, uid) : null;

  if (!req) notFound();

  const logs = await getStatusLogs(id);
  // A missing payments collection just means nothing has been paid yet.
  const payments = await listPaymentsForRef(id).catch(() => []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background pt-16">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/kundali/requests"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> All my requests
            </Link>

            {/* Header card */}
            <div className="rounded-3xl border border-accent/40 bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-bold text-primary">{req.code}</p>
                  <h1 className="mt-1 font-serif text-3xl font-bold text-foreground">{req.service}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Requested on {formatDateTime(req.createdAt)}
                  </p>
                </div>
                <span className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${STATUS_STYLE[req.status] || ''}`}>
                  {STATUS_LABEL[req.status] || req.status}
                </span>
              </div>

              {/* PDF box */}
              <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5">
                {req.hasPdf ? (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">Your Kundali PDF is ready</p>
                        <p className="text-sm text-muted-foreground">Download and keep it safe.</p>
                      </div>
                    </div>
                    <a
                      href={`/api/kundali/requests/${req.id}/pdf`}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-all hover:bg-accent hover:text-foreground active:scale-95"
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm">
                      Your detailed report is being prepared. It will appear here once it&apos;s ready.
                    </p>
                  </div>
                )}
              </div>

              {/* Always-available instant summary */}
              <a
                href={`/api/kundali/requests/${req.id}/summary`}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-accent/60 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent/20"
              >
                <Download className="h-4 w-4" /> Download Summary PDF
              </a>
            </div>

            {/* Payments */}
            <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-bold text-foreground">
                <IndianRupee className="h-5 w-5 text-primary" /> Payment
              </h2>

              {payments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5">
                  <p className="text-sm text-muted-foreground">
                    No payment has been submitted for this request yet.
                  </p>
                  <Link
                    href={`/payment?kind=kundali&refId=${req.id}&ref=${req.code}&service=${encodeURIComponent(req.service)}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-accent hover:text-foreground active:scale-95"
                  >
                    <IndianRupee className="h-4 w-4" /> Pay now
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {payments.map((payment) => (
                    <li
                      key={payment.id}
                      className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-muted/30 p-4"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-foreground">
                          ₹{Number(payment.amount).toLocaleString('en-IN')}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          UTR <span className="font-mono font-semibold">{payment.utr}</span> ·
                          submitted {formatDateTime(payment.createdAt)}
                        </p>
                        {payment.reviewNote && (
                          <p className="mt-1.5 text-sm text-muted-foreground">{payment.reviewNote}</p>
                        )}
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                          PAYMENT_STATUS_STYLE[payment.status] || ''
                        }`}
                      >
                        {PAYMENT_STATUS_LABEL[payment.status] || payment.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Birth details */}
            <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="mb-2 font-serif text-xl font-bold text-foreground">Submitted details</h2>
              <div className="divide-border">
                <Row label="Name" value={req.name} />
                <Row label="Email" value={req.email} />
                <Row label="Mobile" value={req.phone} />
                <Row label="Date of Birth" value={req.dob} />
                <Row label="Time of Birth" value={req.unknownBirthTime ? 'Not known' : req.birthTime} />
                <Row label="Place of Birth" value={req.birthPlace} />
                <Row label="Preferred Language" value={req.language} />
                {req.questions && <Row label="Questions / Notes" value={req.questions} />}
              </div>
            </div>

            {/* Status timeline */}
            <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="mb-5 font-serif text-xl font-bold text-foreground">Status timeline</h2>
              <ol className="space-y-5">
                {logs.map((log, i) => (
                  <li key={log.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          i === logs.length - 1 ? 'bg-primary text-white' : 'bg-muted text-primary'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      {i < logs.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                    </div>
                    <div className="pb-1">
                      <p className="font-semibold text-foreground">{STATUS_LABEL[log.to] || log.to}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(log.at)}</p>
                      {log.note && <p className="mt-1 text-sm text-muted-foreground">{log.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
