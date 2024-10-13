export const prerender = true;

import { defineCustomElements } from '@ionic/pwa-elements/loader';

if (typeof window !== 'undefined') {
    // Register the PWA elements on the client side
    defineCustomElements(window);
}