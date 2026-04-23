---
title: Deferred Intent Payment Element
description: Rendering the Payment Element first, then create an Intent
docs:
- title: Collect payment details first
  url: https://docs.stripe.com/payments/accept-a-payment-deferred
- title: Payment Element
  url: https://docs.stripe.com/payments/payment-element
snippets:
- path: intent-first/server
  intentType: payment
  label: server
- path: intent-first/setup-server
  label: server
  intentType: setup
- path: deferred-intent/payment-client
  label: client
  intentType: payment
- path: deferred-intent/setup-client
  label: client
  intentType: setup
---
::::layout-card{img="https://images.pexels.com/photos/8327551/pexels-photo-8327551.jpeg" title="Deferred Intent" subtitle="Render the Payment Element first, only create and Intent when confirming" imgHeight="300"}
#default
  :::side-by-side
  #header
  This integration allows you to render the Payment Element without first creating an Intent.  The Intent is created during the confirmation function. This ensures you don't create Intents before Customers are ready to confirm.  You specify the details like `amount` and `currency` when creating the Stripe.js elements instance.
  
  #left
    ::stripe-params-form
    ::

  #right
    ::stripe-payment-element{elementsType="deferred"}
    ::
  :::
#info
  :::menu-button{cardColor="light-blue-lighten-5"}
    While this approach may seem more clean, since it doesn't create a bunch of incomplete intents, it requires attention to detail.  The parameters used to create the Intent and the Elements session must match in order to successfully confirm. 

    If you need to change the parameters after rendering the Payment Element, you must update the elements instance before confirming.
  :::

#actions
  ::stripe-code-button
  ::
::::