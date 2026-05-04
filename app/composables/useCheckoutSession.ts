import type { Stripe } from 'stripe'

// useCheckoutSession is intentionally separate from useIntent — Checkout Sessions
// return a { session } object and drive a completely different client lifecycle
// (redirect to session.url, or mount an embedded surface) rather than feeding a
// client_secret into stripe.elements() for confirmPayment/confirmSetup.
export function useCheckoutSession() {
  const params = useStripeParams()

  const query = useAsyncData<{ session: Stripe.Checkout.Session }>(
    'checkout-session',
    (_nuxtApp, { signal }) =>
      $fetch('/api/stripe/checkout-sessions', {
        method: 'POST',
        // uiMode is spread in alongside sessionParams so the server can read it
        // as a top-level field and extract it before building the Stripe API call.
        body: {
          ...params.value.checkoutSession.server,
          uiMode: params.value.checkoutSession.uiMode,
        },
        signal,
      }),
    { server: false, immediate: false, dedupe: 'cancel' },
  )

  return { data: query.data, error: query.error, execute: query.execute }
}
