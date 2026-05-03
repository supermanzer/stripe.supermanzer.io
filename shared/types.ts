// shared/types.ts - Types that can be used across both client and server runtimes.

export interface Doc {
    title: string;
    url: string;
}

export interface Snippet {
    path: string;
    label: 'server' | 'client';
    intentType?: 'payment' | 'setup';
}

export enum ElementType {
    IntentFirst = "intent-first",
    Deferred = "deferred"
}

// 'custom' uses the same initCheckoutElementsSdk client API as 'elements' but
// with a different server-side session configuration for custom form layouts.
export type CheckoutUiMode = 'hosted_page' | 'embedded_page' | 'elements' | 'custom'
export type CheckoutMode = 'payment' | 'subscription' | 'setup'