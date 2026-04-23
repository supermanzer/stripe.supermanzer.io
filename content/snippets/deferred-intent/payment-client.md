---
language: javascript
reference: https://docs.stripe.com/js/elements_object/create_without_intent
---

```javascript
// Load Stripe.js using Publishable Key
const stripe = loadStripe("pk_******");

// Create elements instance without an intent
const elements = stripe.elements({
    mode: 'payment'
    amount: 1999,
    currency: "usd"
});

// Create and mount Payment Element
const element = elements.create('payment');
element.mount('#payment-element');

// Create function to handle confirmation on button click
const confirmOnClick = async() => {
    // Validate form fields
    const { error: submitError } = await elements.value.submit();

    if (submitError) {
        // Handle error
    }
    // Only create the Intent after we've validated with no errors
    const { clientSecret } = await getItent();

    // Confirm Payment
    const { error: confirmError } = await $stripe.confirmPayment({
        elements: elements.value,
        clientSecret: clientSecret,
        confirmParams: {
            return_url: successUrl,
        }
    });
    if (confirmError) {
        // Handle error
    }
}