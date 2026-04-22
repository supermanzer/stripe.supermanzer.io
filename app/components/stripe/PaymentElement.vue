<template>
  <div style="position: relative;">
    <v-card 
    title="Payment Element"
    flat
    >
        <slot name="text" />
        <div id="payment-element"/>
        <v-row class="my-6" justify="space-around">
            <v-tooltip location="left" text="Check testing docs for Payment Methods (e.g. card numbers) you can use">
                <template #activator="{props}">
                    <v-btn variant="elevated" color="grey" href="https://docs.stripe.com/testing" target="_blank" text="Test Docs" v-bind="props"/>
                </template>
            </v-tooltip>
            <v-btn variant="elevated" color="primary" text="Confirm" @click="confirmPayment"/>
        </v-row>


    <v-dialog v-model="showReloadDialog" max-width="480" persistent contained>
        <v-card>
            <v-card-title>Parameters Changed</v-card-title>
            <v-divider />
            <v-card-text>
            {{dialogMessage}}
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

import type { StripePaymentElement, StripeElements, Appearance } from '@stripe/stripe-js';
import { ElementType } from '~~/shared/types';

// Defining props we pass in from parent components (including in Markdown files)
const {elementsType} = defineProps({
    elementsType: {type: String as () => ElementType, required: false, default: ElementType.IntentFirst}
})
// Setting appearance based on user's theme preference
const { isDark } = useThemePreference()
const appearance = computed<Appearance>(() => ({
    theme: isDark.value ? 'night' : 'stripe'
}))
// Loading Stripe.js and parameters
const {$stripe} = useNuxtApp();
const params = useStripeParams();
// Loading our Payment Element composable
const {data, error, execute} = usePaymentIntent();
// Defining URLs 
const { origin } = useRequestURL();
const { urls } = useAppConfig();
const successUrl = `${origin}${urls.successPath}`
// Creating references for the Stripe elments
const elements = ref<StripeElements|null>(null)
const element = ref<StripePaymentElement|null>(null)
// Taracking if we should show reload dialog
const showReloadDialog = ref(false)

const dialogMessage = computed(() => {
    const msg = elementsType == 'intent-first' ? "Payment Intent parameters have changed. Reload the Payment Element to create a new Payment Intent with the updated parameters." : "Parameters have changed. Reload the payment element to keep them in sync."

    return msg
})

// Intent-first creates the server-side intent before mounting; deferred skips this step.
if (elementsType === ElementType.IntentFirst) {
    console.log("GOT ELEMENTS TYPE");
    
    await execute();
}

const mountElement = () => {
    if ($stripe == null) return;

    if (elementsType === ElementType.Deferred) {
        const { amount, currency } = params.value.paymentIntent.server;
        elements.value = $stripe.elements({
            mode: 'payment',
            currency: currency ?? 'usd',
            amount: amount ?? 0,
            appearance: appearance.value,
        });
    } else {
        if (error.value != null || data.value?.intent?.client_secret == null) {
            console.error("Failed to initialize Payment Element", { error: error.value, intent: data.value?.intent });
            return;
        }
        elements.value = $stripe.elements({
            clientSecret: data.value.intent.client_secret,
            appearance: appearance.value,
        });
    }

    element.value = elements.value.create('payment');
    element.value.mount('#payment-element');
}

onMounted(mountElement)

watch(() => params.value.hasChanged, (changed) => {
    if (changed) showReloadDialog.value = true
})

const reload = async () => {
    element.value?.unmount()
    element.value = null
    elements.value = null
    // Deferred mode has no server intent to refresh; intent-first needs a new one.
    if (elementsType === ElementType.IntentFirst) {
        await execute()
    }
    await nextTick()
    mountElement()
    params.value.hasChanged = false
    showReloadDialog.value = false
}

const confirmPayment = async () => {
    if (elements.value === null || $stripe == null) {
        console.error("Cannot confirm: Stripe or Elements not initialized");
        return
    }

    if (elementsType === ElementType.Deferred) {
        // Step 1: validate the form fields before touching the server.
        const { error: submitError } = await elements.value.submit();
        if (submitError) {
            console.error("PAYMENT ELEMENT SUBMIT ERROR:\n", submitError);
            return;
        }
        // Step 2: create the Payment Intent server-side now that we know the form is valid.
        await execute();
        if (error.value || data.value?.intent?.client_secret == null) {
            console.error("Failed to create Payment Intent for deferred confirmation", { error: error.value });
            return;
        }
        // Step 3: confirm with the freshly-minted clientSecret passed explicitly.
        const { error: confirmError } = await $stripe.confirmPayment({
            elements: elements.value,
            clientSecret: data.value.intent.client_secret,
            confirmParams: {
                return_url: successUrl,
                ...params.value.paymentIntent.confirm,
            }
        });
        if (confirmError) {
            console.error("PAYMENT INTENT CONFIRMATION ERROR:\n", confirmError);
        }
    } else {
        const { error: confirmError } = await $stripe.confirmPayment({
            elements: elements.value,
            confirmParams: {
                return_url: successUrl,
                ...params.value.paymentIntent.confirm,
            }
        });
        if (confirmError) {
            console.error("PAYMENT INTENT CONFIRMATION ERROR:\n", confirmError);
        }
    }
}
</script>