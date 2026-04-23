<template>
  <v-card flat class="h-100 pe-4 border-e-md">
    <v-card-title>Stripe Parameters</v-card-title>
    <v-divider />
    <v-card-subtitle>Update the below parameters to modify the integration</v-card-subtitle>
    <v-card-text>
      <v-row justify="center">
        <v-btn-toggle
         v-model="intentType"
         color="primary"
         border
         mandatory
        >
          <v-btn value="payment">Payment Intent</v-btn>
          <v-btn value="setup">Setup Intent</v-btn>
        </v-btn-toggle>
      </v-row>
      <v-row>
        <v-col v-if="intentType === 'payment'" cols="12" sm="12" md="12" lg="6">
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
  get: () => intentType.value === 'setup'
    ? params.value.setupIntent.client.currency
    : params.value.paymentIntent.server.currency ?? 'usd',
  set: (val) => {
    if (intentType.value === 'setup') {
      params.value.setupIntent.client.currency = val
    } else {
      params.value.paymentIntent.server.currency = val
    }
    params.value.hasChanged = true
  },
})

const intentType = computed({
  get: () => params.value.intentType ?? 'payment',
  set: (val) => {params.value.intentType = val;
    params.value.hasChanged = true},
})
</script>
