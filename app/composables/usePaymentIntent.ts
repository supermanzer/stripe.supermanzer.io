/**
 * Exposes method(s) used to interaction with the Payment Intents API on the server
 */
import type { Stripe } from 'stripe'

export function usePaymentIntent() {
  const intent = ref<Stripe.PaymentIntent | null>(null)
  const pending = ref(false)
  const error = ref<Error | null>(null)

  async function createPaymentIntent() {
    pending.value = true
    error.value = null
    try {
      const data = await $fetch<{ intent: Stripe.PaymentIntent }>('/api/stripe/payment-intents', {
        method: 'POST',
      })
      intent.value = data.intent
    } catch (e) {
      error.value = e as Error
    } finally {
      pending.value = false
    }
  }

  return { intent, pending, error, createPaymentIntent }
}
