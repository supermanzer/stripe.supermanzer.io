import type { Stripe } from 'stripe'

export function useIntent() {
  const params = useStripeParams()

  const paymentQuery = useAsyncData<{ intent: Stripe.PaymentIntent }>(
    'payment-intent',
    (_nuxtApp, { signal }) =>
      $fetch('/api/stripe/payment-intents', {
        method: 'POST',
        body: params.value.paymentIntent.server,
        signal,
      }),
    { server: false, immediate: false, dedupe: 'cancel' },
  )

  const setupQuery = useAsyncData<{ intent: Stripe.SetupIntent }>(
    'setup-intent',
    (_nuxtApp, { signal }) =>
      $fetch('/api/stripe/setup-intents', {
        method: 'POST',
        body: params.value.setupIntent.server,
        signal,
      }),
    { server: false, immediate: false, dedupe: 'cancel' },
  )

  const data = computed(() =>
    params.value.intentType === 'payment' ? paymentQuery.data.value : setupQuery.data.value
  )

  const error = computed(() =>
    params.value.intentType === 'payment' ? paymentQuery.error.value : setupQuery.error.value
  )

  const execute = () =>
    params.value.intentType === 'payment' ? paymentQuery.execute() : setupQuery.execute()

  return { data, error, execute }
}
