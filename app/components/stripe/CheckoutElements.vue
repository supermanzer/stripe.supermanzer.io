<template>
  <div style="position: relative;">
    <v-card title="Checkout Elements" flat>
      <slot name="text" />

      <!-- Payment and billing address elements mount into these divs -->
      <div id="checkout-payment-element" class="my-4" />
      <div id="checkout-billing-element" class="my-4" />

      <v-row class="my-6" justify="space-around">
        <v-tooltip location="left" text="Check testing docs for Payment Methods (e.g. card numbers) you can use">
          <template #activator="{ props }">
            <v-btn
              variant="elevated"
              color="grey"
              href="https://docs.stripe.com/testing"
              target="_blank"
              text="Test Docs"
              v-bind="props"
            />
          </template>
        </v-tooltip>
        <v-btn
          variant="elevated"
          color="primary"
          text="Confirm"
          :loading="confirming"
          @click="confirmCheckout"
        />
      </v-row>

      <v-alert v-if="confirmError" type="error" class="ma-4">
        {{ confirmError }}
      </v-alert>

      <v-dialog v-model="showReloadDialog" max-width="480" persistent>
        <v-card>
          <v-card-title>Parameters Changed</v-card-title>
          <v-divider />
          <v-card-text>
            Params changed. Reload to reinitialize the Checkout Elements session.
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
import type {
  StripeCheckoutElementsSdk,
  StripePaymentElement,
  StripeAddressElement,
} from '@stripe/stripe-js'
import type { Appearance } from '@stripe/stripe-js'

const { $stripe } = useNuxtApp()
const params = useStripeParams()
const { isDark } = useThemePreference()
const { data, error, execute } = useCheckoutSession()

const confirming = ref(false)
const confirmError = ref<string | null>(null)
const showReloadDialog = ref(false)

// Hold SDK and element references so we can clean up on reload.
let checkoutSdk: StripeCheckoutElementsSdk | null = null
let paymentElement: StripePaymentElement | null = null
let billingElement: StripeAddressElement | null = null

const appearance = computed<Appearance>(() => ({
  theme: isDark.value ? 'night' : 'stripe',
}))

// The params store is shared across pages. If the user visited the
// checkout-session page first, uiMode may be 'hosted_page' or 'embedded_page'.
// Those sessions don't return a client_secret, which initCheckoutElementsSdk
// requires. Enforce compatibility here rather than relying on CheckoutParamsForm's
// onMounted correction — that runs after this execute() call, so it's too late.
if (params.value.checkoutSession.uiMode !== 'elements' && params.value.checkoutSession.uiMode !== 'custom') {
  params.value.checkoutSession.uiMode = 'elements'
}

await execute()

const mountElements = () => {
  if (!$stripe || !data.value?.session.client_secret) {
    console.error('Cannot mount Checkout Elements: missing Stripe instance or client_secret', {
      error: error.value,
    })
    return
  }

  // initCheckoutElementsSdk is synchronous — it returns the SDK immediately
  // rather than a Promise, unlike createEmbeddedCheckoutPage.
  checkoutSdk = $stripe.initCheckoutElementsSdk({
    clientSecret: data.value.session.client_secret,
    elementsOptions: { appearance: appearance.value },
  })

  paymentElement = checkoutSdk.createPaymentElement()
  paymentElement.mount('#checkout-payment-element')

  billingElement = checkoutSdk.createBillingAddressElement()
  billingElement.mount('#checkout-billing-element')
}

onMounted(mountElements)

watch(() => params.value.hasChanged, (changed) => {
  if (changed) showReloadDialog.value = true
})

const confirmCheckout = async () => {
  if (!checkoutSdk) return

  confirming.value = true
  confirmError.value = null

  // loadActions() returns a discriminated union — we must check type before
  // accessing actions.confirm() to avoid a runtime error on the error branch.
  const result = await checkoutSdk.loadActions()

  if (result.type === 'error') {
    confirmError.value = result.error.message
    confirming.value = false
    return
  }

  const { error: confirmErr } = await result.actions.confirm()

  if (confirmErr) {
    confirmError.value = confirmErr.message ?? 'Confirmation failed'
  }

  confirming.value = false
}

const reload = async () => {
  // Unmount elements before destroying the SDK instance to avoid
  // dangling DOM references.
  paymentElement?.unmount()
  billingElement?.unmount()
  paymentElement = null
  billingElement = null
  checkoutSdk = null

  // Re-apply the uiMode guard in case params changed to an incompatible mode
  // between initial mount and reload (e.g. via direct store manipulation).
  if (params.value.checkoutSession.uiMode !== 'elements' && params.value.checkoutSession.uiMode !== 'custom') {
    params.value.checkoutSession.uiMode = 'elements'
  }

  await execute()
  await nextTick()
  mountElements()

  params.value.hasChanged = false
  showReloadDialog.value = false
}
</script>
