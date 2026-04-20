---
language: javascript
---

```javascript
const stripe = await loadStripe("pk_*******"); // Load Stripe.js using Publishable Key

const {intent} = await getIntent() // retrieve Payment Intent from the server

const elements = stripe.elements({clientSecret: intent.client_secret}); // Create Elements instance with Payment Intent client secret

// Create and mount Payment Element
const element = elements.create('payment'); 
element.mount('#payment-element');

// Create function to handle Payment Intent confirmation, often triggered by a button click
const confirmOnClick = async () => {
    const {error} = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: "your.awesome.website.dev"
        }
    })
}
```