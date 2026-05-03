---
language: typescript
reference: https://docs.stripe.com/api/checkout/sessions/create
---

```typescript
// Create Stripe instance with Secret Key
const stripe = new Stripe("sk_********");

const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  ui_mode: 'embedded_page',
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: { name: 'Demo Product' },
        unit_amount: 1999,
      },
      quantity: 1,
    },
  ],
  // embedded_page uses a single return_url for all outcomes —
  // success_url and cancel_url are forbidden in this mode.
  // {CHECKOUT_SESSION_ID} is replaced by Stripe before redirecting.
  return_url: 'https://yoursite.com/return?session_id={CHECKOUT_SESSION_ID}',
});

// Return client_secret (not url) — it's used by createEmbeddedCheckoutPage()
return { session };
```
