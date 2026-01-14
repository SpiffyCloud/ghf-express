import HomePage from '@/views/HomePage.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'

import { ActionSheet } from '@capacitor/action-sheet'
import { App } from '@capacitor/app'
import { Preferences } from '@capacitor/preferences'
import { Share } from '@capacitor/share'
import JsBarcode from 'jsbarcode'

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

function flushPromises() {
  return new Promise<void>((resolve) => {
    // Works in Node + jsdom and avoids fake timers.
    setTimeout(() => resolve(), 0)
  })
}

function getDigitKey(wrapper: ReturnType<typeof mount>, digit: string) {
  const keys = wrapper.findAll('button.key')
  const match = keys.find((b) => b.text().trim() === digit)
  if (!match) throw new Error(`Digit key not found: ${digit}`)
  return match
}

async function mountHomePage() {
  const wrapper = mount(HomePage, {
    // Ionic container components are provided by the @ionic/vue mock.
  })

  // Allow onMounted async work to finish.
  await flushPromises()
  await nextTick()
  return wrapper
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('HomePage.vue', () => {
  test('renders membership keypad when no stored barcode', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: null })

    const wrapper = await mountHomePage()
    expect(wrapper.text()).toContain('GHF Express')
    expect(wrapper.text()).toContain('Enter your membership ID')

    expect(wrapper.find('button[aria-label="save"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button[aria-label="backspace"]').attributes('disabled')).toBeDefined()
  })

  test('enables save after 6 digits and persists to Preferences', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: null })

    const wrapper = await mountHomePage()
    const saveButton = () => wrapper.find('button[aria-label="save"]')

    expect(saveButton().attributes('disabled')).toBeDefined()

    for (const digit of ['1', '2', '3', '4', '5', '6']) {
      await getDigitKey(wrapper, digit).trigger('click')
    }

    expect(saveButton().attributes('disabled')).toBeUndefined()

    await saveButton().trigger('click')
    await flushPromises()
    await nextTick()

    expect(Preferences.set).toHaveBeenCalledWith({ key: 'barcode', value: '123456' })
    expect(wrapper.find('#barcode').exists()).toBe(true)
    expect(JsBarcode).toHaveBeenCalled()
  })

  test('loads stored barcode and renders it on mount', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: '654321' })
    vi.mocked(App.getInfo).mockResolvedValueOnce({ version: '2.3.4' } as any)

    const wrapper = await mountHomePage()
    await flushPromises()
    await nextTick()

    expect(wrapper.find('#barcode').exists()).toBe(true)
    expect(JsBarcode).toHaveBeenCalledWith(
      '#barcode',
      '654321',
      expect.objectContaining({ format: 'CODE39' }),
    )
    expect(wrapper.text()).toContain('v2.3.4')
  })

  test('shows unknown version if App.getInfo fails', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: '654321' })
    vi.mocked(App.getInfo).mockRejectedValueOnce(new Error('no app plugin'))

    const wrapper = await mountHomePage()
    await flushPromises()
    await nextTick()

    expect(wrapper.find('#barcode').exists()).toBe(true)
    expect(wrapper.text()).toContain('v?.?.?')
  })

  test('edit switches from barcode view back to keypad', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: '111222' })

    const wrapper = await mountHomePage()
    await flushPromises()
    await nextTick()

    expect(wrapper.find('#barcode').exists()).toBe(true)
    await wrapper.find('button[aria-label="edit barcode"]').trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain('Enter your membership ID')
  })

  test('delete uses ActionSheet destructive option and clears Preferences', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: '123456' })
    vi.mocked(ActionSheet.showActions).mockResolvedValueOnce({ index: 0 } as any)

    const wrapper = await mountHomePage()
    await flushPromises()
    await nextTick()

    await wrapper.find('button[aria-label="delete barcode"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(Preferences.clear).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Enter your membership ID')
  })

  test('delete falls back to window.confirm if ActionSheet fails', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: '123456' })
    vi.mocked(ActionSheet.showActions).mockRejectedValueOnce(new Error('no plugin'))
    const confirmSpy = vi.spyOn(window, 'confirm' as any).mockReturnValue(true)

    const wrapper = await mountHomePage()
    await flushPromises()
    await nextTick()

    await wrapper.find('button[aria-label="delete barcode"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(confirmSpy).toHaveBeenCalled()
    expect(Preferences.clear).toHaveBeenCalled()
  })

  test('delete resets UI even if Preferences.clear fails', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: '123456' })
    vi.mocked(ActionSheet.showActions).mockResolvedValueOnce({ index: 0 } as any)
    vi.mocked(Preferences.clear).mockRejectedValueOnce(new Error('storage failed'))

    const wrapper = await mountHomePage()
    await flushPromises()
    await nextTick()

    await wrapper.find('button[aria-label="delete barcode"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(Preferences.clear).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Enter your membership ID')
  })

  test('hides barcode view if JsBarcode throws during render', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: null })
    vi.mocked(JsBarcode).mockImplementationOnce(() => {
      throw new Error('render failed')
    })

    const wrapper = await mountHomePage()
    const saveButton = () => wrapper.find('button[aria-label="save"]')

    for (const digit of ['1', '2', '3', '4', '5', '6']) {
      await getDigitKey(wrapper, digit).trigger('click')
    }

    await saveButton().trigger('click')
    await flushPromises()
    await nextTick()

    expect(Preferences.set).toHaveBeenCalledWith({ key: 'barcode', value: '123456' })
    expect(wrapper.find('#barcode').exists()).toBe(false)
    expect(wrapper.text()).toContain('Enter your membership ID')
  })

  test('share button calls Capacitor Share plugin', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: null })

    const wrapper = await mountHomePage()
    await wrapper.find('button[aria-label="share"]').trigger('click')
    await flushPromises()

    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Share GHF Express',
        url: expect.stringContaining('apps.apple.com'),
      }),
    )
  })
})
