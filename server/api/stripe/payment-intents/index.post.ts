
import { useServerStripe } from "~~/server/utils/stripe"

export default defineEventHandler(async () => {
    // console.log("POST REQUEST TO PAYMENT INTENTS:\n", event);

    const stripe = useServerStripe();

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1999,
        currency: 'usd',
    })
    return { intent: paymentIntent }
})