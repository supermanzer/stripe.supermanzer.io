import type { Stripe } from 'stripe'
import { useServerStripe } from '~~/server/utils/stripe'

export default defineEventHandler(async (event) => {
  const stripe = useServerStripe()
  const body = await readBody<Partial<Stripe.PaymentIntentCreateParams>>(event)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1999,
    currency: 'usd',
    ...body,
  })

  return { intent: paymentIntent }
})
