---
title: Payment Element
description: A simple implementation of the Stripe Payment Element using the intent-first initialization approach.
docs:
- https://docs.stripe.com/payments/accept-a-payment?payment-ui=elements&api-integration=paymentintents
- https://docs.stripe.com/payments/payment-element
---
::layout-card{img="https://images.pexels.com/photos/4482896/pexels-photo-4482896.jpeg" title="Payment Element" subtitle="Collect multiple payment method types through a single interface"}
  
  ::side-by-side
  #header
    A simple, intent-first, Payment Element integration.  When the page is rendered server side, a Payment Intent is generated. This is sent to the client where, once the page loads in the browser, Stripe.js is initialized and used to mount the Payment Element.  Modify the parameters in the form and re-render the Payment Element to observe what changes.
    
    ::menu-button{cardColor="light-blue-lighten-5"}
      Since this is an intent first integration, each time the parameters are changed and the Payment Element is reloaded, a new Payment Intent is created.  This results Payment Intents being left in a status of `requires_payment_method`.  
      
      There is nothing wrong with this approach and it is still the most simple integration but some people don't like seeing all those orphaned Payment Intents in their Stripe dashboard.
    ::
    

  #left
    ::stripe-params-form
    ::
  #right
    ::stripe-payment-element 
    ::
  ::
::
