---
language: tyescipt
reference: https://docs.stripe.com/api/setup_intents/create
---

```typescript
 // create Stripe instance with Secret Key
const stripe = new Stripe("sk_********");

const setupIntent = await stripe.SetupIntents.create({})

return {intent: setupIntent}
```