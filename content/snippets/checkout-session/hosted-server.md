---
language: typescript
reference: https://docs.stripe.com/api/checkout/sessions/create
---

```typescript
// Create Stripe instance with Secret Key
const stripe = new Stripe("sk_********");

// Inline price_data means no pre-existing product or price needed in Stripe
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  ui_mode: 'hosted_page',
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
  // success_url and cancel_url are for hosted_page only —
  // embedded modes use return_url instead.
  success_url: 'https://yoursite.com/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://yoursite.com/cancel',
});

return { session };
```
