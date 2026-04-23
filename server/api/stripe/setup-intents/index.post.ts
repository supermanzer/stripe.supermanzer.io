import type { Stripe } from 'stripe'
import { useServerStripe } from '~~/server/utils/stripe'

export default defineEventHandler(async (event) => {
    const stripe = useServerStripe()
    const body = await readBody<Partial<Stripe.SetupIntentCreateParams>>(event)

    const setupIntent = await stripe.setupIntents.create(body as Stripe.SetupIntentCreateParams)

    return { intent: setupIntent }
})
