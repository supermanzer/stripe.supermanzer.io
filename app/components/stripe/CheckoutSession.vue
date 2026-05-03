<template>
  <div style="position: relative;">
    <v-card title="Checkout Session" flat>
      <slot name="text" />

      <!-- Hosted: just a button — the checkout UI lives on Stripe's domain -->
      <v-row v-if="uiMode === 'hosted'" class="my-6" justify="space-around">
        <v-btn
          variant="elevated"
          color="primary"
          text="Checkout"
          :loading="pending"
          @click="startHostedCheckout"
        />
      </v-row>

      <!-- Embedded page: Stripe mounts an iframe into this div -->
      <div v-if="uiMode === 'embedded_page'" id="checkout" />

      <v-dialog v-model="showReloadDialog" max-width="480" persistent contained>
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
import type { CheckoutUiMode } from '#shared/types'

const { uiMode } = defineProps<{ uiMode: CheckoutUiMode }>()

const { $stripe } = useNuxtApp()
const params = useStripeParams()
const { data, error, pending, execute } = useCheckoutSession()
const showReloadDialog = ref(false)

// Hold the embedded checkout instance so we can destroy and remount it when
// params change — destroy() is required before creating a new instance.
let embeddedCheckout: StripeEmbeddedCheckout | null = null

// Embedded page needs the session created before mount so we have the
// client_secret ready for createEmbeddedCheckoutPage().
if (uiMode === 'embedded_page') {
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
  if (uiMode === 'embedded_page') {
    await mountEmbedded()
  }
})

watch(() => params.value.hasChanged, (changed) => {
  if (!changed) return

  if (uiMode === 'embedded_page') {
    // Show a dialog so the user explicitly triggers the remount — avoids
    // destroying an active checkout mid-fill.
    showReloadDialog.value = true
  } else {
    // Hosted mode is stateless per click; no surface to reload.
    // Just clear the flag so future changes are detected correctly.
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
