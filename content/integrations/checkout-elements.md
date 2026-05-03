---
title: Checkout Elements
description: Build a custom payment form using the Checkout Elements SDK
docs:
- title: Checkout Elements SDK
  url: https://docs.stripe.com/js/custom_checkout/init
- title: Build a custom checkout page
  url: https://docs.stripe.com/payments/build-a-checkout-page
- title: Appearance API
  url: https://docs.stripe.com/elements/appearance-api
snippets:
- path: checkout-session/elements-server
  label: server
- path: checkout-session/elements-client
  label: client
---
::::layout-card{img="https://images.pexels.com/photos/6347720/pexels-photo-6347720.jpeg" title="Checkout Elements" subtitle="Compose Stripe's payment components onto your own form with CSS-level customization" imgHeight="300"}
#default
  :::side-by-side
  #header
    Checkout Elements (`ui_mode: 'elements'`) gives you the highest degree of customization in the Checkout Session family. Your server still creates the session, but the client uses `stripe.initCheckoutElementsSdk()` to mount individual Elements — payment, billing address, express checkout — on a form you control entirely.

    Confirmation is explicit: you call `actions.confirm()` on your own button click, rather than Stripe handling it internally.

  #left
    ::stripe-checkout-params-form
    ::

  #right
    ::stripe-checkout-elements
    ::
  :::

#info
  :::menu-button{cardColor="light-blue-lighten-5"}
    The key difference from the embedded page integration is **who owns the form**. With `embedded_page`, Stripe renders a complete, self-contained checkout UI inside an iframe. With `elements`, you compose the individual Stripe components yourself and arrange them however you need.

    This comes with more responsibility: you call `checkoutSdk.loadActions()` (which returns a discriminated union — check `result.type` before accessing `result.actions`) and then `actions.confirm()` to finalize the payment.

    Note that `initCheckoutElementsSdk` is **synchronous** — it returns the SDK instance immediately rather than a Promise, unlike `createEmbeddedCheckoutPage`. Mount your elements in `onMounted` after initialization.
  :::

#actions
  ::stripe-code-button
  ::
::::
