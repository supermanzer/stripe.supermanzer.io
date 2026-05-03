---
language: javascript
reference: https://docs.stripe.com/js/embedded_checkout/init
---

```javascript
// Load Stripe.js with your Publishable Key
const stripe = await loadStripe("pk_*******");

// Ask your server to create an embedded_page Checkout Session
const { session } = await createCheckoutSession();

// fetchClientSecret is a callback — Stripe will re-call it if the session
// expires, so it should always return the most current client_secret.
const embeddedCheckout = await stripe.createEmbeddedCheckoutPage({
  fetchClientSecret: () => Promise.resolve(session.client_secret),
});

// Stripe injects an iframe into this element
embeddedCheckout.mount('#checkout');

// Later, when done (e.g. on route change):
embeddedCheckout.destroy();
```
