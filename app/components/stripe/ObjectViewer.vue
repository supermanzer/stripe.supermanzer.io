<template>
    <card flat class="mx-12">
        <p class="text-body-large">{{ heading }}</p>
        <pre><code>{{ obj }}</code></pre>
    </card>
</template>

<script setup lang="ts">
import type Stripe from 'stripe';

const route = useRoute();
const {payment_intent, setup_intent} = route.query

let obj: Stripe.PaymentIntent | Stripe.SetupIntent | null = null;
let heading: string | null = null;

const objectName = payment_intent ? 'Payment Intent' : 'Setup Intent';
heading = `You just did something with a ${objectName}! Let's take a look at it, shall we?`;

if (payment_intent) {
    obj = await $fetch<Stripe.PaymentIntent>(`/api/stripe/payment-intents/${payment_intent}/`)
}else if (setup_intent) {
    obj = await $fetch<Stripe.SetupIntent>(`/api/stripe/setup-intents/${setup_intent}`)
}

</script>

<style lang="css" scoped>
pre {
    background-color: black;
}
code {
    color: lawngreen;
}
</style>