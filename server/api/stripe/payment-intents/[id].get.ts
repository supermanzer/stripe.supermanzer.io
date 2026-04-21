

export default defineEventHandler(async (event) => {
    const stripe = useServerStripe();
    const id = getRouterParam(event, 'id');
    if (id === undefined) return;
    const paymentIntent = await stripe.paymentIntents.retrieve(
        id
    )
    return paymentIntent
})