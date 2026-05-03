import { useServerStripe } from '~~/server/utils/stripe'

export default defineEventHandler(async (event) => {
  const stripe = useServerStripe()
  const id = getRouterParam(event, 'id')

  // Guard against missing route param before hitting the Stripe API
  if (!id) return

  const session = await stripe.checkout.sessions.retrieve(id)

  return { session }
})
