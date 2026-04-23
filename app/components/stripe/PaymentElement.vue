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
            <v-btn variant="elevated" color="primary" text="Confirm" @click="confirmIntent"/>
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
// Loading our Intent composable
const {data, error, execute} = useIntent();
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
        elements.value = $stripe.elements(
            params.value.intentType === 'setup'
                ? { mode: 'setup', currency: params.value.setupIntent.client.currency, appearance: appearance.value }
                : {
                    mode: 'payment',
                    currency: params.value.paymentIntent.server.currency ?? 'usd',
                    amount: params.value.paymentIntent.server.amount ?? 0,
                    appearance: appearance.value,
                }
        );
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

// Handles the intent-type dimension: routes to confirmSetup or confirmPayment.
const doConfirm = async (clientSecret?: string) => {
    if (!elements.value || !$stripe) return
    const base = {
        elements: elements.value,
        ...(clientSecret ? { clientSecret } : {}),
    }
    if (params.value.intentType === 'setup') {
        const { error: confirmError } = await $stripe.confirmSetup({
            ...base,
            confirmParams: { return_url: successUrl, ...params.value.setupIntent.confirm },
        })
        if (confirmError) console.error('SETUP INTENT CONFIRMATION ERROR:\n', confirmError)
    } else {
        const { error: confirmError } = await $stripe.confirmPayment({
            ...base,
            confirmParams: { return_url: successUrl, ...params.value.paymentIntent.confirm },
        })
        if (confirmError) console.error('PAYMENT INTENT CONFIRMATION ERROR:\n', confirmError)
    }
}

// Handles the elements-type dimension: deferred creates the intent on confirm; intent-first already has it.
const confirmIntent = async () => {
    if (!elements.value || !$stripe) {
        console.error('Cannot confirm: Stripe or Elements not initialized')
        return
    }
    if (elementsType === ElementType.Deferred) {
        const { error: submitError } = await elements.value.submit()
        if (submitError) { console.error('ELEMENT SUBMIT ERROR:\n', submitError); return }
        await execute()
        if (error.value || data.value?.intent?.client_secret == null) {
            console.error('Failed to create intent for deferred confirmation', { error: error.value }); return
        }
        await doConfirm(data.value.intent.client_secret)
    } else {
        await doConfirm()
    }
}
</script>