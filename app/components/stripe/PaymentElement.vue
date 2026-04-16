<template>
  <div style="position: relative;">
    <v-card 
    title="Payment Element"
    flat
    >
        <slot name="text" />
        <div id="payment-element"/>
        <v-row class="my-6" justify="space-around">
            <v-btn variant="elevated" color="primary" text="Confirm" @click="confirmPayment"/>
        </v-row>


    <v-dialog v-model="showReloadDialog" max-width="480" persistent contained>
        <v-card>
            <v-card-title>Parameters Changed</v-card-title>
            <v-divider />
            <v-card-text>
            Payment Intent parameters have changed. Reload the Payment Element to create a new Payment Intent with the updated parameters, or dismiss to keep the current one.
            </v-card-text>
            <v-card-actions>
            <v-spacer />
            
            <v-btn variant="elevated" color="teal-darken-4" @click="reload">Reload</v-btn>
            </v-card-actions>
            
        </v-card>
    </v-dialog>
   </v-card>
  </div>
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
const showReloadDialog = ref(false)

await execute();

const mountElement = () => {
    if (error.value == null && $stripe != null && data.value?.intent?.client_secret != null) {
        elements.value = $stripe.elements({
            clientSecret: data.value.intent.client_secret
        });
        element.value = elements.value.create('payment');
        element.value.mount('#payment-element');
    } else {
        console.error("Failed to initialize Payment Element", { error: error.value, intent: data.value?.intent });
    }
}

onMounted(mountElement)

watch(() => params.value.hasChanged, (changed) => {
    if (changed) showReloadDialog.value = true
})

const reload = async () => {
    element.value?.unmount()
    element.value = null
    elements.value = null
    await execute()
    await nextTick()
    mountElement()
    params.value.hasChanged = false
    showReloadDialog.value = false
}

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