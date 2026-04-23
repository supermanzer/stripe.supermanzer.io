---
language: typescript
reference: https://docs.stripe.com/api/payment_intents/create
---

```typescript
 // create Stripe instance with Secret Key
const stripe = new Stripe("sk_********");

// specify Payment Intent parameters (defaults shown here)
const params = { amount: 1999, currency: 'usd' } 

// create Payment Intent
const paymentIntent = await stripe.paymentIntents.create(params) 

// return Intent
return { intent: paymentIntent } 
```
