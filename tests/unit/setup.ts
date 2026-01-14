import { vi } from 'vitest'
import { defineComponent, h } from 'vue'

function stub(tag: string) {
  return defineComponent({
    name: tag,
    setup(_, { slots }) {
      return () => h('div', { 'data-stub': tag }, slots.default?.())
    },
  })
}

// Ionic Vue pulls in Ionic Core (Stencil). With newer jsdom/vitest versions,
// Stencil can crash during module init. For unit tests we only need lightweight
// container components.
vi.mock('@ionic/vue', () => ({
  IonApp: stub('IonApp'),
  IonRouterOutlet: stub('IonRouterOutlet'),
  IonPage: stub('IonPage'),
  IonContent: stub('IonContent'),
}))
