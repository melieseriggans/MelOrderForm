# Mel's Treat — Site Documentation
*Last updated: matches the state of the site as of this build session. Re-upload this file at the start of a new conversation so Claude is instantly caught up on your whole system.*

---

## 🌐 Live Site
Base URL: `https://melstreat.com/`
Hosting: GitHub repo → auto-deployed. Every file below lives at the root of that repo, alongside an `assets/` folder for images/video.

## 🗂️ Backend
- **Supabase Project ID:** `wgicnbaoqsekageoygea`
- **Supabase URL:** `https://wgicnbaoqsekageoygea.supabase.co`
- **Stripe Account:** "Mel's Treat" — currently in **TEST MODE** (`sk_test_...` key). Swap to a live key in `create-stripe-checkout` and `stripe-webhook` edge functions when ready to accept real payments — this is intentionally not yet done per your instruction.
- **Email:** Resend, sending from `orders@melstreat.com`

---

## 📄 Pages (all in the repo root)

| File | Purpose |
|---|---|
| `shop.html` | **Home page.** Hero video banner, Fan Favorites carousel, catering promo bar, "Why Mel's Treat", About teaser, mini-FAQ, reviews slideshow, footer. Sticky-note welcome-discount popup. |
| `menu.html` | **The actual shop.** Compact tap-to-add product grid, category tabs (Cookies / Cinnamon Rolls), "Build A Box" guided picker, cart drawer with tip/discount/checkout, Stripe checkout. |
| `index.html` | **Original order form.** Manual payment (Venmo/CashApp/PayPal/Contact Me), used until you're ready to fully switch over to Stripe on `menu.html`. |
| `about.html` | Your story, values, real photos, allergen notice. |
| `testimonials.html` | Public reviews display, pulls live from the `reviews` table. |
| `reviews.html` | Customer-facing review submission form. |
| `review-thankyou.html` | Confirmation after submitting a review. |
| `faq.html` | Expandable FAQ accordion. |
| `catering.html` | Catering request form (3+ dozen). |
| `catering-thankyou.html` | Confirmation after catering request. |
| `catering-payment.html` | Personalized payment page you send to confirmed catering customers (`?amount=&name=&email=`). |
| `catering-payment-thankyou.html` | Confirmation after catering payment. |
| `shop-thankyou.html` | Confirmation after a Stripe checkout completes. |
| `out-of-stock.html` | Shown automatically when all cookies are sold out; offers pre-order or "notify me" signup. |
| `links.html` | Linktree-style public links page. |
| `donations.html` | Placeholder donations page. |
| `privacy-policy.html` | Real, accurate privacy policy. |
| `admin-dashboard.html` | **Your private business hub** — see below. |
| `admin-discounts.html`, `admin-reviews.html` | Older standalone admin pages — fully merged into `admin-dashboard.html` now, no longer needed. |

---

## 🔒 Admin Dashboard (`admin-dashboard.html`)
Password: `taniya123` — now auto-logs in as soon as you finish typing it, no button needed. Installable as a real app icon on your phone (PWA) — Safari/Chrome → "Add to Home Screen."

**Tabs:**
- **Today** — today's pickups, low stock warnings, catering needing a quote
- **Orders** — grouped by pickup date (soonest first), search/filter, bulk status updates, delete button for test/duplicate orders
- **Catering** — grouped by event date, same status/delete tools
- **Inventory** — stock counts + out-of-stock toggle per flavor
- **Ingredients** — spending breakdown, cost-per-cookie calculator
- **Discounts** — create/manage discount codes
- **Reviews** — approve/reject customer reviews
- **Emails** — send marketing emails using templates, **only ever to your opted-in welcome-signup list** (never to order customers — that's intentional, for compliance)
- **Links** — every page's URL with one-tap Visit/Copy buttons
- **Earnings & Tax** — revenue breakdown, quarterly tax estimate, mileage tracker, CSV export

---

## 🗄️ Database Tables (Supabase)
| Table | What it's for |
|---|---|
| `orders` | Every order from `index.html` and `menu.html`/Stripe. Has `source` column to tell them apart, plus `tip_amount`, `discount_code`, `is_preorder`. |
| `catering_requests` / `catering_payments` | Catering pipeline |
| `reviews` | Customer reviews (public read only when `approved = true`) |
| `discount_codes` | All discount codes, including auto-generated welcome codes |
| `welcome_signups` | **The only list used for marketing emails** — people who signed up for the $2-off offer |
| `inventory` | Live stock per flavor, auto-decrements on real orders |
| `restock_notifications` | "Notify me" signups from the out-of-stock page |
| `manual_income` / `manual_expenses` | Off-site payments and ingredient/business spending |
| `mileage_log` | Mileage tracker entries |
| `settings` | Key/value store (tax rate, mileage rate, system health status) |

---

## ⚙️ Edge Functions (Supabase)
| Function | Purpose |
|---|---|
| `send-order-emails` | Order confirmation (owner + customer) |
| `send-review-email` / `send-review-requests` | Review notifications + scheduled 24h-after-order review request |
| `send-catering-email` / `send-catering-payment-email` | Catering notifications |
| `validate-discount-code` / `redeem-discount-code` | Discount code checkout logic |
| `manage-discount-codes` / `manage-reviews` / `manage-dashboard` | Admin CRUD, password-protected |
| `create-stripe-checkout` | Builds the Stripe Checkout Session for `menu.html` |
| `stripe-webhook` | Records paid Stripe orders back into your `orders` table, decrements stock |
| `decrement-inventory` | Stock decrement + low-stock email alert for `index.html` orders |
| `signup-welcome-discount` | Generates a cute one-word discount code (e.g. "SPARKLE") + emails it |
| `send-marketing-email` | Sends your Emails-tab campaigns to the opted-in list only |
| `send-weekly-digest` | Sunday-night email recap of the week |
| `system-health-check` | Runs every 6 hours, alerts you only if something breaks |

---

## 🎨 Design System
- **Colors:** Blush `#fedde4` background · Hot pink `#e20376` primary · Deep pink `#a8025f` hover · Gold `#c8912f` accent · Plum `#7a0146`/`#4d022c` for dark sections
- **Fonts:** Fredoka (headers/buttons) · Pacifico (script accents, sparingly) · Quicksand (body text)
- **Signature elements:** Dashed-gold "wax seal" ring around the logo · Glossy hand-drawn stars (gradient + shine) · Sticker-style badges (white border, shadow, slight tilt) · Checkerboard texture strip

---

## 📌 Known Pending Items
- Stripe still in **test mode** — swap to live key when you're ready to fully move off `index.html`
- Stripe Checkout branding (logo/colors on the actual payment page) can only be set via **your Stripe Dashboard** (Settings → Branding) — not something I can do through the API for a standard account
- About page / other pages could get more of the new glossy-star + sticker-badge treatment if you like how it looks on the home page
