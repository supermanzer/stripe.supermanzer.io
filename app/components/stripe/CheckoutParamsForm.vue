<template>
  <v-card flat class="h-100 pe-4 border-e-md">
    <v-card-title>Checkout Session Parameters</v-card-title>
    <v-divider />
    <v-card-subtitle>Update the below parameters to modify the integration</v-card-subtitle>
    <v-card-text>
      <v-row justify="center">
        <v-btn-toggle
          v-model="uiMode"
          color="primary"
          border
          mandatory
        >
          <v-btn value="hosted">Hosted</v-btn>
          <v-btn value="embedded_page">Embedded</v-btn>
          <v-btn value="elements">Elements</v-btn>
        </v-btn-toggle>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12" lg="6">
          <v-text-field
            v-model="productName"
            label="Product Name"
            hint="Name shown on the Stripe checkout page"
            persistent-hint
          />
        </v-col>
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
        <v-col cols="12" sm="12" md="12" lg="6">
          <v-text-field
            v-model.number="quantity"
            label="Quantity"
            type="number"
            min="1"
            hint="Number of units"
            persistent-hint
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { CheckoutUiMode } from '#shared/types'

const currencies = [
  { value: 'usd', title: 'USD - US Dollar' },
  { value: 'eur', title: 'EUR - Euro' },
  { value: 'gbp', title: 'GBP - British Pound' },
  { value: 'cad', title: 'CAD - Canadian Dollar' },
  { value: 'mxn', title: 'MXN - Mexican Peso' },
]

const params = useStripeParams()

// Helper to safely reach into the nested line_items structure without
// repeating the same deep path throughout computed getters/setters.
function getLineItem() {
  return params.value.checkoutSession.server.line_items?.[0]
}

const uiMode = computed<CheckoutUiMode>({
  get: () => params.value.checkoutSession.uiMode,
  set: (val) => {
    params.value.checkoutSession.uiMode = val
    params.value.hasChanged = true
  },
})

const productName = computed({
  get: () => {
    const item = getLineItem()
    if (item && 'price_data' in item && item.price_data) {
      return (item.price_data as { product_data?: { name?: string } }).product_data?.name ?? ''
    }
    return ''
  },
  set: (val: string) => {
    const item = getLineItem()
    if (item && 'price_data' in item && item.price_data) {
      const pd = item.price_data as { product_data?: { name?: string } }
      if (pd.product_data) pd.product_data.name = val
    }
    params.value.hasChanged = true
  },
})

const amount = computed({
  get: () => {
    const item = getLineItem()
    if (item && 'price_data' in item && item.price_data) {
      return (item.price_data as { unit_amount?: number }).unit_amount ?? 0
    }
    return 0
  },
  set: (val: number) => {
    const item = getLineItem()
    if (item && 'price_data' in item && item.price_data) {
      (item.price_data as { unit_amount?: number }).unit_amount = val
    }
    params.value.hasChanged = true
  },
})

const currency = computed({
  get: () => {
    const item = getLineItem()
    if (item && 'price_data' in item && item.price_data) {
      return (item.price_data as { currency?: string }).currency ?? 'usd'
    }
    return 'usd'
  },
  set: (val: string) => {
    const item = getLineItem()
    if (item && 'price_data' in item && item.price_data) {
      (item.price_data as { currency?: string }).currency = val
    }
    params.value.hasChanged = true
  },
})

const quantity = computed({
  get: () => getLineItem()?.quantity ?? 1,
  set: (val: number) => {
    const item = getLineItem()
    if (item) item.quantity = val
    params.value.hasChanged = true
  },
})
</script>
