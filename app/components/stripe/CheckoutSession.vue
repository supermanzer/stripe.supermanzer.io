<template>
  <div style="position: relative;">
    <v-card title="Checkout Session" flat>
      <slot name="text" />

      <!-- Hosted page: just a button — the checkout UI lives on Stripe's domain -->
      <v-row v-if="uiMode === 'hosted_page'" class="my-6" justify="space-around">
        <v-btn
          variant="elevated"
          color="primary"
          text="Checkout"
          :loading="pending"
          @click="startHostedCheckout"
        />
      </v-row>

      <!-- Embedded page: Stripe mounts an iframe into this div.
           min-height ensures the card has room to expand before the iframe
           loads — without it the container collapses and the checkout is invisible. -->
      <div v-if="uiMode === 'embedded_page'" id="checkout" class="checkout-mount" />

      <!-- No 'contained' — the dialog must overlay the viewport, not the card.
           The card's height varies with the embedded iframe, so containing the
           dialog would leave it invisible or clipped when the form is small. -->
      <v-dialog v-model="showReloadDialog" max-width="480" persistent>
        <v-card>
          <v-card-title>Parameters Changed</v-card-title>
          <v-divider />
          <v-card-text>
            Params changed. Reload to reinitialize the embedded checkout.
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
import type { StripeEmbeddedCheckout } from '@stripe/stripe-js'

const { $stripe } = useNuxtApp()
const params = useStripeParams()
const { data, error, pending, execute } = useCheckoutSession()
const showReloadDialog = ref(false)

// uiMode is read from the params store so the CheckoutParamsForm toggle
// directly controls which UI surface this component displays.
const uiMode = computed(() => params.value.checkoutSession.uiMode)

// Hold the embedded checkout instance so we can destroy and remount it when
// params change — destroy() is required before creating a new instance.
let embeddedCheckout: StripeEmbeddedCheckout | null = null

// Embedded page needs the session created before mount so we have the
// client_secret ready for createEmbeddedCheckoutPage().
if (uiMode.value === 'embedded_page') {
  await execute()
}

const mountEmbedded = async () => {
  if (!$stripe || !data.value?.session.client_secret) return

  // fetchClientSecret is a callback rather than a plain string so Stripe can
  // re-invoke it if the session expires during an active checkout.
  embeddedCheckout = await $stripe.createEmbeddedCheckoutPage({
    fetchClientSecret: () => Promise.resolve(data.value!.session.client_secret!),
  })
  embeddedCheckout.mount('#checkout')
}

onMounted(async () => {
  if (uiMode.value === 'embedded_page') {
    await mountEmbedded()
  }
})

watch(() => params.value.hasChanged, async (changed) => {
  if (!changed) return

  if (uiMode.value === 'embedded_page') {
    // Show a dialog so the user explicitly triggers the remount — avoids
    // destroying an active checkout mid-fill.
    showReloadDialog.value = true
  } else {
    // hosted_page is stateless per click — a fresh session is always created
    // on the next button press, so there's nothing to reload.
    // If we were previously in embedded mode, clean up the instance.
    embeddedCheckout?.destroy()
    embeddedCheckout = null
    params.value.hasChanged = false
  }
})

// Hosted flow: create a fresh session on each click, then redirect.
// A new session is always needed because sessions are single-use.
const startHostedCheckout = async () => {
  await execute()

  if (error.value || !data.value?.session.url) {
    console.error('Failed to create hosted Checkout Session', { error: error.value })
    return
  }

  window.location.href = data.value.session.url
}

const reload = async () => {
  // destroy() cleans up the iframe — unmount() alone is insufficient when
  // we want to replace the session entirely.
  embeddedCheckout?.destroy()
  embeddedCheckout = null

  await execute()
  await nextTick()
  await mountEmbedded()

  params.value.hasChanged = false
  showReloadDialog.value = false
}
</script>

<style scoped>
/* Gives the card enough room to display the Stripe iframe before it finishes
   loading and self-sizes. 650px covers the typical embedded checkout height. */
.checkout-mount {
  min-height: 650px;
}
</style>
