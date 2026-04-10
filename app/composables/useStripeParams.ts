import type { Stripe } from 'stripe'
import type { ConfirmPaymentData, ConfirmSetupData } from '@stripe/stripe-js'

// --- Per-object param types ---

export type PaymentIntentParams = {
  server:  Partial<Stripe.PaymentIntentCreateParams>
  confirm: Partial<ConfirmPaymentData>
}

export type SetupIntentParams = {
  server:  Partial<Stripe.SetupIntentCreateParams>
  confirm: Partial<ConfirmSetupData>
}

export type AppParams = {
  activeAccount?: string
}

// --- Top-level state shape ---

export type StripeParamsState = {
  paymentIntent: PaymentIntentParams
  setupIntent:   SetupIntentParams
  app:           AppParams
}

// --- Defaults ---

const defaults: StripeParamsState = {
  paymentIntent: {
    server:  { amount: 1999, currency: 'usd' },
    confirm: {},
  },
  setupIntent: {
    server:  {},
    confirm: {},
  },
  app: {},
}

// --- Composable ---

export function useStripeParams() {
  return useState<StripeParamsState>('stripe-params', () => structuredClone(defaults))
}
