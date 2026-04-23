---
language: javascript
reference: https://docs.stripe.com/js/elements_object/create
---

```javascript
// Load Stripe.js using Publishable Key
const stripe = await loadStripe("pk_*******"); 

// retrieve Payment or Setup Intent client secret from the server
const { clientSecret } = await getIntent() 

// Create Elements instance with Payment Intent client secret
const elements = stripe.elements({ clientSecret }); 

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
    if (error) {
        // Handle error
    }
}
```