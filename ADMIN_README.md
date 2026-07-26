# Admin Panel / CMS

A MongoDB-backed admin panel to manage the website's content and images without touching code.

## Getting started

1. **Restart the dev server** so it loads the new `.env.local` file:
   ```
   npm run dev
   ```
2. Open **http://localhost:3000/admin**
3. Log in with the credentials from `.env.local`:
   - Username: `admin`
   - Password: `ChangeMe123!`  ← **change this** in `.env.local`

## What you can do

- **Sections** (`/admin`) — edit any content section with a friendly form:
  text fields, add/remove/reorder list items, and pick images from the library.
  Every section also has a raw **JSON** view for advanced edits.
  - Home → Stats, Achievements
  - Consultants, Services & Pricing, Puja & Anushthan
  - Testimonials, FAQs, Podcasts, Instagram Reels
  - Site Info, Contact Details, **WhatsApp Numbers**, Navigation & Social Links,
    Payment (UPI QR & Bank)
- **Payments** (`/admin/payments`) — see below.
- **Images** (`/admin/images`) — upload photos (JPG/PNG/WEBP/GIF/SVG, max 6 MB),
  then select them in any image field. Images are stored in MongoDB and served
  from `/api/images/<id>`.
- **Save** publishes instantly. **Reset to original** restores the built-in default.

## Payments (manual UPI, until Razorpay)

Payment is collected today by showing the UPI QR code. There is no payment
gateway in the loop, so **nothing is automatic** — a human has to check the bank
statement.

**The flow**

1. After a booking is submitted (consultation, puja, or Kundali PDF) the site
   shows the QR code and asks for the **UTR / transaction reference number**.
   There is also a standalone page at `/payment` for anyone quoted a price over
   WhatsApp.
2. The submission lands in **Admin → Payments** as *Pending Verification*.
3. Open the bank statement, match the UTR and the amount, then hit **Approve**
   (or **Reject** with a reason — the reason is shown back to the client).
4. Approving a payment does not move the booking's own status. Update the lead
   or Kundali request separately, as before.

**Setting up the QR code and bank details**

Everything on the payment step lives in **Website Content → Payment (UPI QR &
Bank)**:

- **Qr Image** — upload the QR under **Admin → Images**, then hit "Choose from
  library" on this field. (A file at `public/payment-qr.jpg` also works.)
- **Upi Id** — optional; shown as copyable text beside the QR when filled in.
- **Bank Account** — account holder, number, IFSC, branch and type, shown as a
  "pay by bank transfer" block under the QR. Any line left blank is hidden.
- **Note** / **Steps** — the wording and the numbered instructions.

**Notes**

- Payments live in the `payments` collection. A unique index on `utr` means the
  same transaction reference can never be submitted twice.
- The public submit endpoint is rate-limited to 5 attempts per minute per IP and
  carries a honeypot field, like the other public forms.
- When Razorpay is wired up later it replaces `components/PaymentPanel.js`;
  verified payments can keep landing in the same collection, so the admin screen
  and the history survive the switch.

## How it works

- Content lives in MongoDB (`content` collection); images in the `images` collection.
- Until a section is edited, pages show the original defaults from `/data/*.js`.
  If the database is ever unreachable, pages fall back to those defaults — the
  site never breaks.
- A saved section is topped up with any **new** fields added in code since it was
  saved, so a field like the bank account appears without having to reset the
  section. Lists are never merged — an edited list is taken exactly as saved, so
  items you removed stay removed.
- Pages read content via `getContent('<key>')` in `lib/content.js`.

## Making more pages editable (already-registered sections)

The home page **Stats** and **Achievements** already read live from the CMS.
Other sections are editable in the panel but their pages still read the static
`/data` files. To make a page live, in its **server** component:

```js
import { getContent } from '@/lib/content';
export const dynamic = 'force-dynamic';

export default async function Page() {
  const testimonials = await getContent('testimonials');
  return <Testimonials items={testimonials} />; // pass as a prop
}
```
Then have the (client) component accept that prop instead of importing from `/data`.

## Configuration (`.env.local`)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | Database name (default `astrology_cms`) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin login |
| `ADMIN_SESSION_SECRET` | Signs the login cookie — set a long random string |

## Security notes

- `.env.local` is git-ignored — never commit it.
- **Rotate the MongoDB password** (it was shared in chat) and update `MONGODB_URI`.
- Change `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` before going live.
- On the live host (e.g. Vercel), set these same variables in the project's
  environment settings.
