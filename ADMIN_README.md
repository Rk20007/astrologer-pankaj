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
  - Testimonials, FAQs, Podcasts
  - Site Info, Contact Details, Navigation & Social Links
- **Images** (`/admin/images`) — upload photos (JPG/PNG/WEBP/GIF/SVG, max 6 MB),
  then select them in any image field. Images are stored in MongoDB and served
  from `/api/images/<id>`.
- **Save** publishes instantly. **Reset to original** restores the built-in default.

## How it works

- Content lives in MongoDB (`content` collection); images in the `images` collection.
- Until a section is edited, pages show the original defaults from `/data/*.js`.
  If the database is ever unreachable, pages fall back to those defaults — the
  site never breaks.
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
