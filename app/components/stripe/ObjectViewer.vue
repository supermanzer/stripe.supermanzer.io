<template>
    <v-card flat class="mx-12">
        <v-card-text>
            <p class="text-body-large">{{ heading }}</p>
            <pre v-if="obj"><code>{{ JSON.stringify(obj, null, 2) }}</code></pre>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type Stripe from 'stripe';

const route = useRoute();
const { payment_intent, setup_intent, session_id } = route.query

// Derive a human-readable object name from whichever query param is present.
// The success/return page passes exactly one of these depending on integration type.
let objectName: string
if (payment_intent) {
  objectName = 'Payment Intent'
} else if (setup_intent) {
  objectName = 'Setup Intent'
} else {
  objectName = 'Checkout Session'
}

const heading = `You just did something with a ${objectName}! Let's take a look at it, shall we?`

const { data: obj } = useAsyncData<Stripe.PaymentIntent | Stripe.SetupIntent | Stripe.Checkout.Session | null>(
  'intent-result',
  () => {
    if (payment_intent) {
      return $fetch<Stripe.PaymentIntent>(`/api/stripe/payment-intents/${payment_intent}`)
    } else if (setup_intent) {
      return $fetch<Stripe.SetupIntent>(`/api/stripe/setup-intents/${setup_intent}`)
    } else if (session_id) {
      // Checkout Sessions (all ui_modes) land here — the session_id is injected
      // by Stripe into the return/success URL via the {CHECKOUT_SESSION_ID} template.
      return $fetch<Stripe.Checkout.Session>(`/api/stripe/checkout-sessions/${session_id}`)
    }
    return Promise.resolve(null)
  },
  { server: false },
)
</script>

<style lang="css" scoped>
pre {
    background-color: black;
}
code {
    color: lawngreen;
}
</style>