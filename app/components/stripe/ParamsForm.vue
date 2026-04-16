<template>
  <v-card flat class="h-100">
    <v-card-title>Stripe Parameters</v-card-title>
    <v-divider />
    <v-card-subtitle>Update the below parameters to modify the integration</v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="12" md="12" lg="6">
          <v-text-field
            v-model.number="amount"
            label="Amount"
            type="number"
            min="1"
            :hint="`Entered in smallest currency unit (e.g. cents for ${currency.toUpperCase()})`"
            persistent-hint
          />
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="6">
          <v-select
            v-model="currency"
            label="Currency"
            :items="currencies"
            hint="Select the presentment currency"
            persistent-hint
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const currencies = [
  { value: 'usd', title: 'USD - US Dollar' },
  { value: 'eur', title: 'EUR - Euro' },
  { value: 'gbp', title: 'GBP - British Pound' },
  { value: 'cad', title: 'CAD - Canadian Dollar' },
  { value: 'mxn', title: 'MXN - Mexican Peso' },
]

const params = useStripeParams()

const amount = computed({
  get: () => params.value.paymentIntent.server.amount ?? 0,
  set: (val) => { params.value.paymentIntent.server.amount = val; params.value.hasChanged = true },
})

const currency = computed({
  get: () => params.value.paymentIntent.server.currency ?? 'usd',
  set: (val) => { params.value.paymentIntent.server.currency = val; params.value.hasChanged = true},
})
</script>
