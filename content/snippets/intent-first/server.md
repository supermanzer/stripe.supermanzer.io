---
language: typescript
---

```typescript
const stripe = new Stripe("sk_********"); // create Stripe instance with Secret Key

const params = { amount: 1999, currency: 'usd' } // specify Payment Intent parameters (defaults shown here)

const paymentIntent = await stripe.paymentIntents.create(params) // create Payment Intent

return { intent: paymentIntent } // return Intent
```
