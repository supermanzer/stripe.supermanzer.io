# stripe.supermanzer.io

A document-driven showcase of [Stripe](https://stripe.com) payment integrations built with [Nuxt 4](https://nuxt.com), [Vuetify](https://vuetifyjs.com), and [Nuxt Content v3](https://content.nuxt.com).

Each integration is a Markdown page that embeds a live, working Stripe component using MDC syntax. The goal is a clean reference site where the implementation details and the working demo live side by side.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4 |
| UI | Vuetify 4 |
| Content | Nuxt Content v3 (Markdown + MDC) |
| Stripe client | `@stripe/stripe-js` |
| Stripe server | `stripe-node` |
| Fonts | `@nuxt/fonts` (Montserrat + Lato) |
| Utilities | VueUse |

## Integrations

| Page | Route |
|------|-------|
| Payment Element | `/integrations/payment-element` |

## Setup

Install dependencies:

```bash
npm install
```

Copy the example env file and add your Stripe test keys:

```bash
cp .env.example .env
```

```ini
STRIPE_PK=pk_test_...
STRIPE_SK=sk_test_...
```

## Development

```bash
npm run dev       # http://localhost:3000
```

## Production

```bash
npm run build     # Build for production
npm run generate  # Static site generation
npm run preview   # Preview production build
```

## Adding an Integration

1. Create `content/integrations/<slug>.md` with frontmatter:

```yaml
---
title: Your Integration Name
description: One-line description of what this demonstrates.
docs:
  - https://docs.stripe.com/...
---
```

2. Add a corresponding component at `app/components/stripe/<ComponentName>.vue`.
3. Embed it in the Markdown via MDC: `::stripe-<component-name>`

The new route and index card appear automatically — no page files or nav config needed.

## Project Structure

```
app/
  app.vue                   # Root; global font + heading styles
  app.config.ts             # stripe.successPath, stripe.cancelPath
  layouts/default.vue       # App shell: header, v-main, footer
  plugins/stripe.client.ts  # Loads Stripe.js; provides $stripe
  composables/
    usePaymentIntent.ts     # useAsyncData wrapper for POST /api/stripe/payment-intents
  components/
    layout/
      AppHeader.vue         # Gradient app bar with site nav
      AppFooter.vue         # Gradient footer
      Card.vue              # Vuetify card wrapper used by Stripe components
    stripe/
      PaymentElement.vue    # Stripe Payment Element integration
  pages/
    index.vue               # Home: renders index.md + integration card grid
    [...slug].vue           # Catch-all: renders any content/*.md page

server/
  utils/stripe.ts           # useServerStripe() singleton
  api/stripe/
    payment-intents/index.post.ts  # POST /api/stripe/payment-intents

content/
  index.md                  # Home page content
  about.md                  # About page
  integrations/
    payment-element.md      # Payment Element demo page
```
