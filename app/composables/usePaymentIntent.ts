/**
 * Exposes method(s) used to interaction with the Payment Intents API on the server
 */
import type { Stripe } from 'stripe'

export function usePaymentIntent() {
  return useAsyncData<{ intent: Stripe.PaymentIntent }>(
    'payment-intent',
    (_nuxtApp, { signal }) =>
      $fetch('/api/stripe/payment-intents', {
        method: 'POST',
        signal,
      }),
    {
      server: false,    // user-triggered; skip SSR
      immediate: false, // don't fire on mount
      dedupe: 'cancel', // cancel in-flight if re-triggered
    },
  )
}
