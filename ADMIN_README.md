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
  - Home → **Banner**, Stats, Achievements
  - Consultants, Services & Pricing, Puja & Anushthan
  - Testimonials, FAQs, Podcasts, Instagram Reels
  - Site Info, Contact Details, **WhatsApp Numbers**, Navigation & Social Links,
    Payment (UPI QR & Bank)
- **Leads & Bookings** (`/admin/leads`) — see *Rescheduling* below.
- **Availability** (`/admin/availability`) — working hours, days off and
  individual blocked times; see *Availability* below.
- **Login & Password** (`/admin/account`) — change the panel's username and
  password; see *Changing the password* below.
- **Payments** (`/admin/payments`) — see below.
- **Images** (`/admin/images`) — upload photos (JPG/PNG/WEBP/GIF/SVG, max 6 MB),
  then select them in any image field. Images are stored in MongoDB and served
  from `/api/images/<id>`.
- **Save** publishes instantly. **Reset to original** restores the built-in default.

## Rescheduling appointments (missed bookings)

Every consultation on **Admin → Leads & Bookings** has a **Reschedule** button.
It opens the chosen date's real slots, so a time that is booked, blocked or
already gone by cannot be picked by mistake.

- An appointment whose time has passed while it was still open (*new*,
  *contacted*, *confirmed* or *rescheduled*) is flagged **missed** — on the
  dashboard, as a counter and banner on the leads page, and as an orange strip
  on the booking itself. The **Needs reschedule** filter lists exactly those.
- Rescheduling sets the status to **rescheduled**, frees the old slot for
  someone else and reserves the new one. Every move is kept on the booking, so
  you can see it was moved and why.
- Two bookings can never end up in the same slot. Tick **book it anyway** to
  override the schedule itself (outside working hours, a day off, a blocked
  time) — but a slot another client holds is still refused.
- The extra statuses **missed** and **cancelled** both release the slot back to
  the website; every other status keeps it reserved.

## Availability

- **Weekly working hours** and **slot length** generate the bookable times.
- **Days off / holidays** close a whole date.
- **Block individual times** closes single slots on one date — pick the date,
  then click any time to switch it off. Blocked times vanish from the booking
  form while the rest of the day stays open. A time that already has an
  appointment in it shows as booked instead; free it by cancelling or
  rescheduling that booking on the Leads page.
- Times that have already gone by today are never offered, and the schedule is
  read in Indian time (IST) whatever timezone the server runs in.
- Remember to hit **Save changes** — blocked times save with the rest of the
  schedule.

## Changing the password

**Admin → Login & Password** changes the username and password of this panel.
You are asked for the current password even though you are signed in, so a
machine left logged in cannot be used to lock you out.

- The new password is stored in the database as a **scrypt hash**, never in
  plain text. From then on the `ADMIN_PASSWORD` in `.env.local` stops working —
  a leaked env file is no longer a way in.
- Saving signs out every **other** browser; the one you are using stays in.
- **Locked out?** Delete the `adminAccount` document from the `settings`
  collection in MongoDB. The login falls straight back to `ADMIN_USERNAME` /
  `ADMIN_PASSWORD` from `.env.local`.

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
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Starting admin login — ignored once a password is set in **Login & Password** |
| `ADMIN_SESSION_SECRET` | Signs the login cookie — set a long random string |

## Security notes

- `.env.local` is git-ignored — never commit it.
- **Rotate the MongoDB password** (it was shared in chat) and update `MONGODB_URI`.
- Set your own password under **Admin → Login & Password**, and set a long
  random `ADMIN_SESSION_SECRET`, before going live.
- On the live host (e.g. Vercel), set these same variables in the project's
  environment settings.
