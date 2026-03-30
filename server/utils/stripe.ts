import Stripe from 'stripe'

let instance: Stripe | null = null

export function useServerStripe(): Stripe {
  if (!instance) {
    const { STRIPE_SK } = useRuntimeConfig()
    instance = new Stripe(STRIPE_SK)
  }
  return instance
}
