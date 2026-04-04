---
title: Payment Element
description: A simple implementation of the Stripe Payment Element using the intent-first initialization approach.
docs:
- https://docs.stripe.com/payments/accept-a-payment?payment-ui=elements&api-integration=paymentintents
- https://docs.stripe.com/payments/payment-element
---

::stripe-payment-element
#text
This is a simple, intent-first, Payment Element integration.  When the page is rendered server side, a Payment Intent is generated. This is sent to the client where, once the page loads in the browser, Stripe.js is initialized and used to mount the Payment Element
::

