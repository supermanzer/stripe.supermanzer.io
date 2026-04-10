<template>
   <LayoutCard 
     img="https://images.pexels.com/photos/4482896/pexels-photo-4482896.jpeg" 
     title="Payment Element" 
     subtitle="Collect multiple payment method types through a single interface"
     >
     <template #text><slot name="text" /></template>

    <template #default>
        <div id="payment-element"/>
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

const params = useStripeParams();

const {data, error, execute} = usePaymentIntent();
const { origin } = useRequestURL();
const { urls } = useAppConfig();



const successUrl = `${origin}${urls.successPath}`

const elements = ref<StripeElements|null>(null)
const element = ref<StripePaymentElement|null>(null)

await execute();

onMounted(() => {
    if (error.value == null && $stripe != null && data.value?.intent?.client_secret != null) {
        elements.value = $stripe.elements({
            clientSecret: data.value.intent.client_secret
        });
        element.value = elements.value.create('payment');
        element.value.mount('#payment-element');
    } else {
        console.error("Failed to initialize Payment Element", { error: error.value, intent: data.value?.intent });
    }
})

const confirmPayment = async() => {
    if (elements.value === null || $stripe == null) {
        console.error("Cannot confirm: Stripe or Elements not initialized");
        return
    }
    const {error} = await $stripe.confirmPayment({
        elements: elements.value,
        confirmParams: {
            return_url: successUrl,
            ...params.value.paymentIntent.confirm,
        }
    })
    if (error) {
        console.error("PAYMENT INTENT CONFIRMATION ERROR:\n", error);
    }
}

</script>