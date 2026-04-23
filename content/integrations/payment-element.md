---
title: Payment Element
description: Use the Payment Element with an intent-first approach.
docs:
- title: Accept a Payment
  url: https://docs.stripe.com/payments/accept-a-payment?payment-ui=elements&api-integration=paymentintents
- title: Payment Element
  url: https://docs.stripe.com/payments/payment-element
snippets:
- path: intent-first/server
  label: server
  intentType: payment
- path: intent-first/setup-server
  label: server
  intentType: setup
- path: intent-first/payment-client
  label: client
  intentType: payment
- path: intent-first/setup-client
  label: client
  intentType: setup
---
::::layout-card{img="https://images.pexels.com/photos/4482896/pexels-photo-4482896.jpeg" title="Payment Element" subtitle="Collect multiple payment method types through a single interface" imgHeight="200"}
#default
  :::side-by-side
  #header
    A simple, intent-first, Payment Element integration.  When the page is rendered server side, a Payment Intent is generated. This is sent to the client where, once the page loads in the browser, Stripe.js is initialized and used to mount the Payment Element.  Modify the parameters in the form and re-render the Payment Element to observe what changes.

  #left
    ::stripe-params-form
    ::
  #right
    ::stripe-payment-element 
    ::
  :::

#info
  :::menu-button{cardColor="light-blue-lighten-5"}
    This is referred to as an intent first integration because the first step is to create a Payment Intent before you can render the Payment Element.  If you do this automatically, as we do here, it means any time someone visits this page an new Payment Intent is generated.  
    
    For this specific set up, any time you change the parameters we generate a new Payment Intent and re-initialize the Payment Element.  This can result in a large number of Payment Intents with a status of `requires_payment_method` that show up as Incomplete in the Stripe dashboard.
    
    There is nothing wrong with this approach and it is still the most simple integration but some people don't like seeing all those orphaned Payment Intents in their Stripe dashboard.
  :::

#actions
  ::stripe-code-button
  ::
::::
