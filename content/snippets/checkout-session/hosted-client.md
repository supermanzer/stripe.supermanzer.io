---
language: javascript
reference: https://docs.stripe.com/payments/accept-a-payment?platform=web&ui=checkout
---

```javascript
// Load Stripe.js with your Publishable Key
const stripe = await loadStripe("pk_*******");

// Ask your server to create a Checkout Session and return the session object
const { session } = await createCheckoutSession();

// Redirect the customer to Stripe's hosted checkout page.
// Stripe handles the entire payment UI — no Elements or confirmPayment needed.
window.location.href = session.url;

// After payment, Stripe redirects back to success_url with:
//   ?session_id=cs_live_... (the real session ID)
// Use that ID to retrieve the session and display a confirmation to the customer.
```
