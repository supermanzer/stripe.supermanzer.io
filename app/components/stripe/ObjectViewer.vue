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
const { payment_intent, setup_intent } = route.query

const objectName = payment_intent ? 'Payment Intent' : 'Setup Intent'
const heading = `You just did something with a ${objectName}! Let's take a look at it, shall we?`

const { data: obj } = useAsyncData<Stripe.PaymentIntent | Stripe.SetupIntent | null>(
  'intent-result',
  () => {
    if (payment_intent) {
      return $fetch<Stripe.PaymentIntent>(`/api/stripe/payment-intents/${payment_intent}`)
    } else if (setup_intent) {
      return $fetch<Stripe.SetupIntent>(`/api/stripe/setup-intents/${setup_intent}`)
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