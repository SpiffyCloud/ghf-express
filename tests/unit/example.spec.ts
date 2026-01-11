import { mount } from '@vue/test-utils'
import HomePage from '@/views/HomePage.vue'
import { IonContent, IonPage } from '@ionic/vue'
import { describe, expect, test, vi } from 'vitest'

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(async () => ({ value: null })),
    set: vi.fn(),
    clear: vi.fn(),
  },
}))

vi.mock('@capacitor/action-sheet', () => ({
  ActionSheet: {
    showActions: vi.fn(async () => ({ index: 1 })),
  },
  ActionSheetButtonStyle: { Destructive: 'destructive', Cancel: 'cancel' },
}))

vi.mock('@capacitor/share', () => ({
  Share: {
    share: vi.fn(),
  },
}))

vi.mock('@capacitor/splash-screen', () => ({
  SplashScreen: {
    hide: vi.fn(),
  },
}))

vi.mock('@capacitor/app', () => ({
  App: {
    getInfo: vi.fn(async () => ({ version: '1.0.0' })),
  },
}))

vi.mock('jsbarcode', () => ({
  __esModule: true,
  default: vi.fn(),
}))

describe('HomePage.vue', () => {
  test('renders membership keypad', () => {
    const wrapper = mount(HomePage, {
      global: {
        components: { IonPage, IonContent },
      },
    })

    expect(wrapper.text()).toContain('GHF Express')
    expect(wrapper.text()).toContain('Enter your membership ID')
  })
})
