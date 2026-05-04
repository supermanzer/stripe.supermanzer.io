---
language: javascript
reference: https://docs.stripe.com/js/custom_checkout/init
---

```javascript
// Load Stripe.js with your Publishable Key
const stripe = await loadStripe("pk_*******");

// Ask your server to create an elements-mode Checkout Session
const { session } = await createCheckoutSession();

// initCheckoutElementsSdk is synchronous — it returns the SDK immediately.
// This is different from createEmbeddedCheckoutPage(), which returns a Promise.
const checkoutSdk = stripe.initCheckoutElementsSdk({
  clientSecret: session.client_secret,
  elementsOptions: { appearance: { theme: 'stripe' } },
});

// Create and mount individual Elements onto your custom form
const paymentElement = checkoutSdk.createPaymentElement();
paymentElement.mount('#checkout-payment-element');

const billingElement = checkoutSdk.createBillingAddressElement();
billingElement.mount('#checkout-billing-element');

// loadActions() returns a discriminated union — check type before confirming
const result = await checkoutSdk.loadActions();

if (result.type === 'error') {
  console.error(result.error.message);
  return;
}

// Email is not collected by the payment or billing elements — it must be
// passed explicitly to confirm(), otherwise Stripe throws an IntegrationError.
const customerEmail = document.getElementById('email-input').value;

const { error } = await result.actions.confirm({ email: customerEmail });

if (error) {
  // Display error to customer
}
```
