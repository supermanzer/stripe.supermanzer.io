import type { Stripe } from 'stripe'
import type { ConfirmPaymentData, ConfirmSetupData } from '@stripe/stripe-js'

// --- Per-object param types ---

export type PaymentIntentParams = {
  server: Partial<Stripe.PaymentIntentCreateParams>
  confirm: Partial<ConfirmPaymentData>
}

export type SetupIntentParams = {
  server: Partial<Stripe.SetupIntentCreateParams>
  confirm: Partial<ConfirmSetupData>
}

// App-level parameters that control the demo environment itself rather than
// individual Stripe API calls. Changes here are expected to trigger side effects
// such as swapping secret/publishable keys and reinitializing both the
// stripe-node (server) and Stripe.js (client) instances.
export type AppParams = {
  // Identifier for the active Stripe account. When changed, the app should
  // reload its Stripe credentials and reinitialize stripe-node and Stripe.js
  // so all subsequent requests use the selected account's keys.
  activeAccount?: string
}


// --- Top-level state shape ---

export type StripeParamsState = {
  paymentIntent: PaymentIntentParams
  setupIntent: SetupIntentParams
  app: AppParams
  hasChanged: boolean
}

// --- Defaults ---

const defaults: StripeParamsState = {
  paymentIntent: {
    server: { amount: 1999, currency: 'usd' }, // default values for required parameters
    confirm: {},
  },
  setupIntent: {
    server: {},
    confirm: {},
  },
  app: {},
  hasChanged: false
}

// --- Composable ---

export function useStripeParams() {
  return useState<StripeParamsState>('stripe-params', () => structuredClone(defaults))
}
