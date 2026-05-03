import type { Stripe } from 'stripe'
import { useServerStripe } from '~~/server/utils/stripe'
import type { CheckoutUiMode } from '#shared/types'

export default defineEventHandler(async (event) => {
  const stripe = useServerStripe()

  // uiMode is extracted separately because it must be renamed to ui_mode for
  // the Stripe API, and it drives URL config below — keeping it distinct from
  // sessionParams makes both responsibilities explicit.
  const { uiMode, ...sessionParams } = await readBody<
    Partial<Stripe.Checkout.SessionCreateParams> & { uiMode: CheckoutUiMode }
  >(event)

  const origin = getRequestURL(event).origin

  // Stripe replaces {CHECKOUT_SESSION_ID} in the URL before redirecting the
  // customer, giving the return page access to the session for status display.
  const SESSION_ID = '{CHECKOUT_SESSION_ID}'

  // hosted_page uses separate success_url + cancel_url (two distinct redirect targets).
  // embedded_page and elements use a single return_url regardless of outcome —
  // the return page checks session.status to determine what happened.
  // Mixing these URL param sets causes a Stripe API validation error.
  let urlConfig: Partial<Stripe.Checkout.SessionCreateParams>
  if (uiMode === 'hosted_page') {
    urlConfig = {
      success_url: `${origin}/success?session_id=${SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    }
  } else {
    urlConfig = {
      return_url: `${origin}/success?session_id=${SESSION_ID}`,
    }
  }

  // All three ui_mode values ('hosted_page', 'embedded_page', 'elements') are
  // valid Stripe API strings, so ui_mode is always passed directly — no special
  // casing needed to omit it for any mode.
  const session = await stripe.checkout.sessions.create({
    ...sessionParams,
    ui_mode: uiMode as Stripe.Checkout.SessionCreateParams.UiMode,
    ...urlConfig,
  } as Stripe.Checkout.SessionCreateParams)

  return { session }
})
