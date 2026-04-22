import type { Stripe } from 'stripe'
import { useServerStripe } from '~~/server/utils/stripe'

export default defineEventHandler(async (event) => {
  const stripe = useServerStripe()
  const body = await readBody<Partial<Stripe.PaymentIntentCreateParams>>(event)

  const paymentIntent = await stripe.paymentIntents.create(body as Stripe.PaymentIntentCreateParams)

  return { intent: paymentIntent }
})
