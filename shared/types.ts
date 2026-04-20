// shared/types.ts - Types that can be used across both client and server runtimes.

export interface Doc {
    title: string;
    url: string;
}

export interface Snippet {
    path: string;
    label: 'server' | 'client';
}
