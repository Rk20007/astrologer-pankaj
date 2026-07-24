import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { STATUS_LABEL, SERVICE_NAME } from '@/lib/kundaliStatusMeta';

// Cream / gold / brown palette, matching the site.
const hex = (h) => {
  const n = parseInt(h.replace('#', ''), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};
const BROWN = hex('#3A2412');
const PRIMARY = hex('#C76B00');
const GOLD = hex('#D4AF37');
const CREAM = hex('#F8F3E8');
const MUTED = hex('#6B5344');
const WHITE = rgb(1, 1, 1);

const A4 = [595.28, 841.89];
const MARGIN = 50;
const CONTENT_W = A4[0] - MARGIN * 2;

// The standard PDF fonts only encode WinAnsi (Latin-1 + a few extras) and THROW
// on anything else — a name or place typed in Devanagari would crash generation.
// Keep encodable characters, map whitespace to spaces, and replace the rest with
// '?' so a summary PDF is always produced.
const WIN1252_EXTRA = new Set(
  [0x2013, 0x2014, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2026, 0x20ac, 0x2122]
);
function sanitize(input) {
  let out = '';
  for (const ch of String(input ?? '')) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x20 && cp <= 0x7e) out += ch; // printable ASCII
    else if (cp >= 0xa0 && cp <= 0xff) out += ch; // Latin-1 supplement
    else if (WIN1252_EXTRA.has(cp)) out += ch; // curly quotes, dashes, bullet…
    else if (cp === 0x09 || cp === 0x0a || cp === 0x0d) out += ' ';
    else out += '?';
  }
  return out;
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Greedy word-wrap for a run of text at a given font/size.
function wrapText(text, font, size, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Builds a premium, instantly-downloadable "request summary" PDF from a Kundali
 * request. This is the acknowledgement the visitor can grab right after booking;
 * the astrologer's full written report is uploaded separately.
 */
export async function generateSummaryPdf(req) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${SERVICE_NAME} — ${req.code}`);
  pdf.setAuthor('Bhawna Upadhyay');
  pdf.setSubject('Kundali PDF request summary');

  const page = pdf.addPage(A4);
  const { height } = page.getSize();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold);

  let y = height;

  // ---- Header band ----
  const bandH = 96;
  page.drawRectangle({ x: 0, y: height - bandH, width: A4[0], height: bandH, color: BROWN });
  page.drawRectangle({ x: 0, y: height - bandH - 4, width: A4[0], height: 4, color: GOLD });

  page.drawText('BHAWNA UPADHYAY', {
    x: MARGIN,
    y: height - 38,
    size: 11,
    font: bold,
    color: GOLD,
  });
  page.drawText('TEDx Speaker • Vedic Astrologer', {
    x: MARGIN,
    y: height - 52,
    size: 8,
    font,
    color: rgb(0.85, 0.82, 0.75),
  });
  page.drawText(SERVICE_NAME, { x: MARGIN, y: height - 78, size: 20, font: serif, color: WHITE });

  y = height - bandH - 34;

  // ---- Meta row (Request ID / Date / Status) ----
  const metaBoxH = 52;
  page.drawRectangle({
    x: MARGIN,
    y: y - metaBoxH + 14,
    width: CONTENT_W,
    height: metaBoxH,
    color: CREAM,
    borderColor: GOLD,
    borderWidth: 1,
  });
  const meta = [
    ['REQUEST ID', req.code || '—'],
    ['DATE', formatDate(req.createdAt)],
    ['STATUS', STATUS_LABEL[req.status] || req.status || '—'],
  ];
  const colW = CONTENT_W / 3;
  meta.forEach(([label, value], i) => {
    const cx = MARGIN + 16 + i * colW;
    page.drawText(label, { x: cx, y: y - 4, size: 7.5, font: bold, color: MUTED });
    page.drawText(sanitize(value), { x: cx, y: y - 20, size: 12, font: bold, color: BROWN });
  });

  y = y - metaBoxH - 20;

  // ---- Section renderer ----
  const drawSection = (title, rows) => {
    page.drawText(title, { x: MARGIN, y, size: 13, font: serif, color: PRIMARY });
    y -= 8;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: MARGIN + CONTENT_W, y },
      thickness: 1,
      color: GOLD,
    });
    y -= 20;

    const labelW = 150;
    for (const [label, value] of rows) {
      const val =
        value === undefined || value === null || value === '' ? '—' : sanitize(value);
      const lines = wrapText(val, font, 11, CONTENT_W - labelW);
      page.drawText(label, { x: MARGIN, y, size: 10, font: bold, color: MUTED });
      lines.forEach((ln, idx) => {
        page.drawText(ln, { x: MARGIN + labelW, y: y - idx * 15, size: 11, font, color: BROWN });
      });
      y -= Math.max(15, lines.length * 15) + 8;
    }
    y -= 12;
  };

  drawSection('Personal Details', [
    ['Full Name', req.name],
    ['Email Address', req.email],
    ['Mobile Number', req.phone],
  ]);

  drawSection('Birth Details', [
    ['Date of Birth', formatDate(req.dob)],
    ['Time of Birth', req.unknownBirthTime ? 'Not known' : req.birthTime],
    ['Place of Birth', req.birthPlace],
  ]);

  drawSection('Additional Information', [
    ['Preferred Language', req.language],
    ['Questions / Notes', req.questions],
  ]);

  // ---- Report coverage note ----
  page.drawRectangle({
    x: MARGIN,
    y: y - 92,
    width: CONTENT_W,
    height: 92,
    color: CREAM,
    borderColor: GOLD,
    borderWidth: 1,
  });
  page.drawText('Your detailed report will cover', {
    x: MARGIN + 16,
    y: y - 20,
    size: 10,
    font: bold,
    color: PRIMARY,
  });
  const coverage =
    'Planetary positions, Mahadasha, Antardasha, Yogas, Doshas, career, marriage, finance, health, and suggested remedies.';
  wrapText(coverage, font, 10, CONTENT_W - 32).forEach((ln, i) => {
    page.drawText(ln, { x: MARGIN + 16, y: y - 38 - i * 14, size: 10, font, color: BROWN });
  });
  page.drawText(
    'This is your request summary. The astrologer will prepare and upload your full written report.',
    { x: MARGIN + 16, y: y - 80, size: 8.5, font, color: MUTED }
  );

  // ---- Footer ----
  page.drawLine({
    start: { x: MARGIN, y: 54 },
    end: { x: MARGIN + CONTENT_W, y: 54 },
    thickness: 0.5,
    color: GOLD,
  });
  page.drawText('Generated by bhawnaupadhyay.com — No online payment required.', {
    x: MARGIN,
    y: 40,
    size: 8,
    font,
    color: MUTED,
  });

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}
