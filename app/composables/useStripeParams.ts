import type { Stripe } from 'stripe'
import type { ConfirmPaymentData, ConfirmSetupData } from '@stripe/stripe-js'
import type { CheckoutUiMode } from '#shared/types'

// --- Per-object param types ---

export type PaymentIntentParams = {
  server: Partial<Stripe.PaymentIntentCreateParams>
  confirm: Partial<ConfirmPaymentData>
}

export type SetupIntentParams = {
  server: Partial<Stripe.SetupIntentCreateParams>
  client: { currency: string }
  confirm: Partial<ConfirmSetupData>
}

// Checkout Sessions bundle both server creation params and the ui_mode choice
// together because ui_mode drives URL config and client-side initialization —
// it belongs to the session concept rather than being a separate app-level concern.
export type CheckoutSessionParams = {
  server: Partial<Stripe.Checkout.SessionCreateParams>
  uiMode: CheckoutUiMode
}

// --- Integration flow param types ---

export type intentTypes = 'payment' | 'setup'

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
  // checkoutSession lives alongside intent slices rather than in a separate
  // composable so that cross-cutting fields (app, hasChanged) stay in one store.
  checkoutSession: CheckoutSessionParams
  intentType: intentTypes
  app: AppParams
  hasChanged: boolean
}



// --- Defaults ---

const defaults: StripeParamsState = {
  paymentIntent: {
    server: { amount: 1999, currency: 'usd' },
    confirm: {},
  },
  setupIntent: {
    server: {},
    client: { currency: 'usd' },
    confirm: {},
  },
  checkoutSession: {
    server: {
      mode: 'payment',
      // price_data lets us define the product inline without needing a
      // pre-existing product or price in the Stripe dashboard.
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Demo Product' },
            unit_amount: 1999,
          },
          quantity: 1,
        },
      ],
    },
    uiMode: 'hosted',
  },
  intentType: 'payment',
  app: {},
  hasChanged: false,
}

// --- Composable ---

export function useStripeParams() {
  return useState<StripeParamsState>('stripe-params', () => structuredClone(defaults))
}
