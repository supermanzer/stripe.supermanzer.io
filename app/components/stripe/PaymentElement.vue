<template>
   <LayoutCard img="https://images.pexels.com/photos/4482896/pexels-photo-4482896.jpeg" title="Payment Element" subtitle="Collect multiple payment method types through a single interface">
    <template #default>
        <div class="payment-element"/>
    </template>
    <template #actions>
        <v-row class="my-6" justify="space-around">
            <v-btn variant="elevated" color="primary" text="Confirm" @click="confirmPayment"/>
        </v-row>
    </template>
   </LayoutCard>
</template>

<script setup lang="ts">
import type { StripePaymentElement, StripeElements } from '@stripe/stripe-js';

const {$stripe} = useNuxtApp();
if ($stripe == null) {
    throw new Error("Stripe instance undefined!");
}

const {intent, pending, error, createPaymentIntent} = usePaymentIntent();
const { origin } = useRequestURL();
const { stripe } =useAppConfig();

const successUrl = `${origin}${stripe.successPath}`

const elements = ref<StripeElements|null>(null)
const element = ref<StripePaymentElement|null>(null)

await createPaymentIntent();

if (error.value === null && $stripe != null && intent.value !== null && intent.value.client_secret !== null && !pending) {
    elements.value = $stripe.elements({
        clientSecret: intent.value.client_secret
    });
    element.value = elements.value.create('payment');
    element.value.mount('#payment-element');
} else {
    console.log("INTENT VALUE:\n", intent);
}

const confirmPayment = async() => {
    const {error} = await $stripe.confirmPayment({
        elements: elements.value,
        confirmParams: {
            return_url: successUrl
        }
    })
}

</script>