---
title: Checkout Session
description: Accept payments using Stripe-hosted or embedded Checkout Sessions
docs:
- title: Checkout Session API
  url: https://docs.stripe.com/api/checkout/sessions
- title: Accept a payment (hosted)
  url: https://docs.stripe.com/payments/accept-a-payment?platform=web&ui=checkout
- title: Embedded Checkout quickstart
  url: https://docs.stripe.com/checkout/embedded/quickstart
snippets:
- path: checkout-session/hosted-server
  label: server
- path: checkout-session/hosted-client
  label: client
- path: checkout-session/embedded-server
  label: server
- path: checkout-session/embedded-client
  label: client
---
::::layout-card{img="https://images.pexels.com/photos/5632390/pexels-photo-5632390.jpeg" title="Checkout Session" subtitle="Stripe hosts or embeds the entire payment form — your server creates the session, Stripe handles the rest" imgHeight="300"}
#default
  :::side-by-side
  #header
    A Checkout Session is a server-side object that drives Stripe's managed payment UI. Unlike the Payment Element, you never call `confirmPayment` — Stripe handles form rendering, validation, and confirmation internally.

    Toggle between **Hosted** (customer redirects to Stripe's domain) and **Embedded** (Stripe renders an iframe on your page) using the params panel. Both modes use the same server-side session creation; only `ui_mode` and the redirect URL fields differ.

  #left
    ::stripe-checkout-params-form
    ::

  #right
    ::stripe-checkout-session
    ::
  :::

#info
  :::menu-button{cardColor="light-blue-lighten-5"}
    **Hosted page** is the simplest Checkout integration — your server creates a session and your client redirects to `session.url`. Stripe manages the entire checkout experience on its own domain, then redirects back to your `success_url` or `cancel_url`.

    **Embedded page** keeps the customer on your site by mounting Stripe's checkout form inside an iframe. The session is created with `ui_mode: 'embedded_page'` and initialized client-side via `stripe.createEmbeddedCheckoutPage({ fetchClientSecret })`. Both outcomes return to a single `return_url`.

    In both modes, `{CHECKOUT_SESSION_ID}` in the redirect URL is replaced by Stripe with the actual session ID before the customer is sent back — giving your return page a way to retrieve and display the session.
  :::

#actions
  ::stripe-code-button
  ::
::::
