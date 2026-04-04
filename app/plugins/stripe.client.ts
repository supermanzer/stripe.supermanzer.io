import { loadStripe } from '@stripe/stripe-js'

export default defineNuxtPlugin(async () => {
  const { public: { STRIPE_PK } } = useRuntimeConfig()
  // console.log("GOT PK:\b", STRIPE_PK);

  const stripe = await loadStripe(STRIPE_PK)

  return {
    provide: { stripe },
  }
})
