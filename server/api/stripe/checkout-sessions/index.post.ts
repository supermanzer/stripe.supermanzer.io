import type { Stripe } from 'stripe'
import { useServerStripe } from '~~/server/utils/stripe'
import type { CheckoutUiMode } from '#shared/types'

export default defineEventHandler(async (event) => {
  const stripe = useServerStripe()

  // uiMode is a client-facing concept we use to drive branching logic below.
  // It is NOT a valid Stripe API param as-is, so we extract it before spreading
  // sessionParams into the stripe.checkout.sessions.create() call.
  const { uiMode, ...sessionParams } = await readBody<
    Partial<Stripe.Checkout.SessionCreateParams> & { uiMode: CheckoutUiMode }
  >(event)

  const origin = getRequestURL(event).origin

  // Stripe replaces {CHECKOUT_SESSION_ID} in the URL before redirecting the
  // customer, giving the return page access to the session for status display.
  const SESSION_ID = '{CHECKOUT_SESSION_ID}'

  // Hosted mode uses success_url + cancel_url (two distinct redirect targets).
  // Embedded and Elements modes use a single return_url regardless of outcome —
  // the page checks session.status to determine what to show.
  // Mixing these sets causes a Stripe API validation error.
  let urlConfig: Partial<Stripe.Checkout.SessionCreateParams>
  if (uiMode === 'hosted') {
    urlConfig = {
      success_url: `${origin}/success?session_id=${SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    }
  } else {
    urlConfig = {
      return_url: `${origin}/success?session_id=${SESSION_ID}`,
    }
  }

  // ui_mode must be omitted entirely for hosted sessions — Stripe rejects
  // any unrecognized value, and 'hosted' is not a valid Stripe API string.
  let uiModeParam: Partial<Stripe.Checkout.SessionCreateParams> = {}
  if (uiMode !== 'hosted') {
    uiModeParam = { ui_mode: uiMode as Stripe.Checkout.SessionCreateParams.UiMode }
  }

  const session = await stripe.checkout.sessions.create({
    ...sessionParams,
    ...uiModeParam,
    ...urlConfig,
  } as Stripe.Checkout.SessionCreateParams)

  return { session }
})
