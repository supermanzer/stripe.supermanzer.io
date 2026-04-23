

export default defineEventHandler(async (event) => {
    const stripe = useServerStripe();
    const id = getRouterParam(event, 'id');
    if (id === undefined) return;
    const setupIntent = await stripe.setupIntents.retrieve(
        id
    )
    return setupIntent
})