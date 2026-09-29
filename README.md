# Studio Kunal Photography — cinematic landing page

Next.js 16 (App Router) · TypeScript · GSAP 3 + ScrollTrigger · Lenis · CSS Modules · self-hosted fonts (Cormorant Garamond + Manrope).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Optional: copy `.env.example` → `.env.local` and set `CONTACT_WEBHOOK_URL` (Formspree / Make / Zapier / your mailer). Without it the endpoint only logs inquiries in development and returns 503 in production, so the flow shows its error state with the WhatsApp and email fallbacks instead of claiming the inquiry was sent.

## Where things live

| Path | What |
| --- | --- |
| `src/content/site.ts` | **Every word of copy**, verbatim from studiokunalphotography.com (crawled 29 Sep 2026). Nav, hero, brand statements, portfolio titles + slugs, films, testimonials, investment, FAQ, contact. |
| `src/content/media.ts` | **Every image assignment.** Real Studio Kunal photographs on the studio's current CDN (i.wfolio.com). Swap a URL here and nothing else changes. |
| `src/lib/gsap.ts` | GSAP + ScrollTrigger registration, shared easings, `matchMedia` queries (`MQ.motion` / `MQ.reduced` / `MQ.desktop`). |
| `src/lib/films.ts` | Resolves real YouTube titles at build time (revalidated daily). Never invents a title. |
| `src/lib/intro.ts` | Tiny event bus so the hero starts exactly when the preloader curtain lifts. |
| `src/components/motion/` | `Preloader`, `SmoothScroll` (Lenis ↔ ScrollTrigger), `Reveal` (one IntersectionObserver for `[data-reveal]`), `Cursor` (fine-pointer only). |
| `src/components/sections/` | `Navigation, Hero, BrandStatement, ImageReveal, Portfolio, CinematicFilms, PortfolioStory, GlobalPresence, Approach, Testimonials, Investment, Faq, Contact, FinalCta, Footer` — one component + one CSS module each. |
| `src/content/inquiry.ts` | Inquiry flow copy, step list, option lists and budget brackets (per currency — qualification ranges, **not** prices; tune with the studio). |
| `src/lib/inquiry/` | `model.ts` (single inquiry object, validation shared by client + server, formatting), `whatsapp.ts` (pre-filled wa.me message), `submit.ts` (configurable submission), `analytics.ts` (event hooks). |
| `src/components/inquiry/` | `InquiryProvider` (state, sessionStorage resume, open/close), `InquiryFlow` (full-screen 8-step flow + review / success / error), `InquiryCta` (every "let's connect" CTA), `FloatingInquire`, `BudgetSelector`, `Fields`. |
| `src/app/api/contact/route.ts` | Inquiry endpoint: re-validates the structured inquiry, honeypot, forwards to `CONTACT_WEBHOOK_URL` (503 in production when unset). |
| `src/app/globals.css` | Design tokens (colour, type scale, tracking, easings), CTA + line-mask primitives, reduced-motion fallbacks. |

## Page sequence

Preloader → Hero → Editorial statement → Cinematic image reveal (pinned) → Our Work, Your Stories → Horizontal portfolio (pinned, desktop) → Cinematic Films (featured screen + index + full-screen viewer) → Story through photography (pinned sequence) → North America ↔ India → Our approach → Testimonial viewer → Investment → Q&A → Get in touch → Final CTA → Footer.

Anchors: `#main #portfolio #cinematic-films #investment #testimonials #get-in-touch`.

## Content accuracy — what was verified against the live site

- Hero headline, brand description (all five sentences), positioning line, "Bookings Open for 2026–2027", "Limited Dates Available", CTA labels SEE OUR MAGIC / LETS CONNECT.
- Navigation: Main · Portfolio · Cinematic Films · Investment · Testimonials · Get In Touch.
- Portfolio: the 8 gallery titles exactly as written (including "The House of Rituals- India" and "Raman & Akash- Love Straight Outta Panjab"); every VIEW STORY link opens the real gallery page.
- Cinematic Films: the 9 YouTube videos embedded on `/cinematicfilms`, in page order. Two titles verified during the build (`Glimpse from Parth & Zeal || Mehndi Ceremony`, `Harkeet & Nina || Fall in love : Again & Again || Eshoot`); the other seven are fetched from YouTube oEmbed at build time. If YouTube can't be reached at build time they display as "Film 02"… — never a made-up title.
- Testimonials: all **nine** on the live Testimonials page, word for word, in site order (the live page now includes Harkeet & Nina in addition to the eight in the brief). Long notes show the first paragraph as the pull-quote with "Read the full note" expanding the rest — nothing is rewritten.
- Investment: the exact paragraph from `/investment`. No packages, no prices.
- Q&A: the five questions and answers from `/get-in-touch`, verbatim (bold spans preserved).
- Contact: `kkunalphotoarts@gmail.com`, Instagram / WhatsApp / YouTube URLs exactly as linked on the site, the intro text, and the site's own success message "Your message was successfully sent!".
- Editorial labels ("THE LAUGHTER … THE MOMENT", "We don't simply document a wedding. We preserve how it felt.") are creative labels, not factual claims. No awards, stats, cities, offices, or clients were added.

## Things to do before launch

1. **Curate the photographs.** The picks in `media.ts` use each gallery's opening frame (and homepage frames 1–24). They were chosen by position, not by eye — spend ten minutes with the photographer choosing the hero, the reveal frame, the six "story" frames and the closing frame. Composition is `object-fit: cover`, so any orientation works.
2. **Host the images yourself.** Images are hot-linked from the current wfolio CDN so the build is faithful today; download the originals into `/public/images` and update `media.ts` before the old site is switched off. `next/image` will generate AVIF/WebP + responsive sizes from either source.
3. **Wire the form.** Set `CONTACT_WEBHOOK_URL` (required in production — without it inquiries are not delivered and the flow falls back to WhatsApp), or replace the fetch in `route.ts` with your mailer (Resend, SES, etc.).
4. `next/image` remote patterns are limited to `i.wfolio.com` and `i.ytimg.com` (`next.config.ts`).

## Motion system

- 80/20 rule: scroll-scrubbed choreography only where it tells the story (image reveal, horizontal portfolio, story sequence, North America → India line); everything else is a masked line rise or a single fade.
- All animation is `transform` / `opacity` / `clip-path`; images are `will-change`d only inside animated frames.
- `prefers-reduced-motion`: Lenis is off, pinned scenes become static sections, GSAP `matchMedia(MQ.reduced)` sets end states, CSS shortens every transition.
- Touch / coarse pointers: no custom cursor, no magnetic buttons, vertical portfolio instead of horizontal pinning.
- Set `NEXT_PUBLIC_UNOPTIMIZED_IMAGES=1` only for offline layout testing (it bypasses the image optimizer).

## Tested

Production build, zero console errors, no horizontal overflow at 1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 375; preloader → hero handoff; anchor navigation; mobile menu; testimonial viewer; FAQ; film lightbox (Esc closes); form submit → success state; reduced-motion variant; single `<h1>`, semantic `<h2>`s; JSON-LD `ProfessionalService`.

## Inquiry flow

Every inquiry CTA (nav, hero, portfolio "Plan your story", films "Let's create your film", investment "Discuss your story", Get in touch, final CTA, floating "Inquire" / mobile "Let's connect") opens the same full-screen flow; `/#inquire` deep-links to it.

You → Reach (email + WhatsApp/phone) → Date (month + year; 2026–2027 flagged "bookings open", past months disabled) → Location (country, city, venue / not decided) → Event (types, days, guests) → Services → Investment (slider, INR / USD / CAD, "not sure yet") → Story → Review (edit any row) → Send → Success or Error. Both outcomes offer **Continue on WhatsApp** to the studio's real number (`contact.whatsapp`) with every answer pre-filled and `encodeURIComponent`-encoded.

- Progress is kept in `sessionStorage` for the current tab only and cleared after a successful send.
- Analytics: listen for `window` `"sk:analytics"` events, or add GTM / gtag — events are pushed to `dataLayer` / `gtag` automatically when present. No personal data is ever included in event properties.
