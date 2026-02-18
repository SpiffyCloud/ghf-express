import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";

import HomePage from "@/views/HomePage.vue";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

vi.mock("jsbarcode", () => ({
  default: vi.fn(),
}));

vi.mock("@capacitor/preferences", () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
  },
}));

vi.mock("@capacitor/app", () => ({
  App: {
    getInfo: vi.fn(),
  },
}));

vi.mock("@capacitor/action-sheet", () => ({
  ActionSheet: {
    showActions: vi.fn(),
  },
  ActionSheetButtonStyle: {
    Destructive: "destructive",
    Cancel: "cancel",
  },
}));

vi.mock("@capacitor/share", () => ({
  Share: {
    share: vi.fn(),
  },
}));

const IonButtonStub = defineComponent({
  name: "IonButton",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  template:
    '<button v-bind="$attrs" :disabled="disabled" @click="$emit(\'click\', $event)"><slot /></button>',
});

const IonContentStub = defineComponent({
  name: "IonContent",
  template: "<div><slot /></div>",
});

const IonPageStub = defineComponent({
  name: "IonPage",
  template: "<div><slot /></div>",
});

const IonIconStub = defineComponent({
  name: "IonIcon",
  template: "<span></span>",
});

const globalStubs = {
  IonButton: IonButtonStub,
  IonContent: IonContentStub,
  IonPage: IonPageStub,
  IonIcon: IonIconStub,
  BackgroundVisuals: true,
  SpiffyLink: true,
};

const appInfo = {
  name: "GHF Express",
  id: "com.spiffycloud.ghfexpress",
  build: "1",
  version: "1.2.3",
};

function getDigitButton(wrapper: ReturnType<typeof mount>, value: string) {
  return wrapper
    .findAll("button")
    .find((button) => button.text().trim() === value);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("HomePage", () => {
  it("loads stored barcode and shows barcode view", async () => {
    const { Preferences } = await import("@capacitor/preferences");
    const { App } = await import("@capacitor/app");

    vi.mocked(Preferences.get).mockResolvedValue({ value: "123456" });
    vi.mocked(App.getInfo).mockResolvedValue(appInfo);

    const wrapper = mount(HomePage, {
      global: {
        stubs: globalStubs,
      },
    });

    await flushPromises();

    expect(wrapper.find("#barcode").exists()).toBe(true);
    expect(wrapper.text()).toContain("v1.2.3");
    expect(
      wrapper.find('button[aria-label="delete barcode"]').exists(),
    ).toBe(true);
  });

  it("allows entering digits and saving", async () => {
    const { Preferences } = await import("@capacitor/preferences");
    const { App } = await import("@capacitor/app");
    const JsBarcode = (await import("jsbarcode")).default;

    vi.mocked(Preferences.get).mockResolvedValue({ value: null });
    vi.mocked(App.getInfo).mockResolvedValue(appInfo);

    const wrapper = mount(HomePage, {
      global: {
        stubs: globalStubs,
      },
    });

    await flushPromises();

    const digits = ["1", "2", "3", "4", "5", "6"];
    for (const digit of digits) {
      const button = getDigitButton(wrapper, digit);
      expect(button).toBeTruthy();
      await button!.trigger("click");
    }

    const saveButton = wrapper.find('button[aria-label="save"]');
    expect(saveButton.attributes("disabled")).toBeUndefined();

    await saveButton.trigger("click");
    await flushPromises();

    expect(Preferences.set).toHaveBeenCalledWith({
      key: "barcode",
      value: "123456",
    });
    expect(JsBarcode).toHaveBeenCalled();
    expect(wrapper.find("#barcode").exists()).toBe(true);
  });

  it("deletes barcode when confirmed", async () => {
    const { Preferences } = await import("@capacitor/preferences");
    const { App } = await import("@capacitor/app");
    const { ActionSheet } = await import("@capacitor/action-sheet");

    vi.mocked(Preferences.get).mockResolvedValue({ value: "123456" });
    vi.mocked(App.getInfo).mockResolvedValue(appInfo);
    vi.mocked(ActionSheet.showActions).mockResolvedValue({ index: 0 });

    const wrapper = mount(HomePage, {
      global: {
        stubs: globalStubs,
      },
    });

    await flushPromises();

    const deleteButton = wrapper.find('button[aria-label="delete barcode"]');
    await deleteButton.trigger("click");
    await flushPromises();

    expect(Preferences.clear).toHaveBeenCalled();
    expect(wrapper.text()).toContain("Enter your membership ID");
  });

  it("switches to edit mode", async () => {
    const { Preferences } = await import("@capacitor/preferences");
    const { App } = await import("@capacitor/app");

    vi.mocked(Preferences.get).mockResolvedValue({ value: "123456" });
    vi.mocked(App.getInfo).mockResolvedValue(appInfo);

    const wrapper = mount(HomePage, {
      global: {
        stubs: globalStubs,
      },
    });

    await flushPromises();

    const editButton = wrapper.find('button[aria-label="edit barcode"]');
    await editButton.trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("Enter your membership ID");
  });

  it("disables save when barcode is incomplete", async () => {
    const { Preferences } = await import("@capacitor/preferences");
    const { App } = await import("@capacitor/app");

    vi.mocked(Preferences.get).mockResolvedValue({ value: null });
    vi.mocked(App.getInfo).mockResolvedValue(appInfo);

    const wrapper = mount(HomePage, {
      global: {
        stubs: globalStubs,
      },
    });

    await flushPromises();

    const saveButton = wrapper.find('button[aria-label="save"]');
    expect(saveButton.attributes("disabled")).toBeDefined();
  });

  it("supports backspace to delete digits", async () => {
    const { Preferences } = await import("@capacitor/preferences");
    const { App } = await import("@capacitor/app");

    vi.mocked(Preferences.get).mockResolvedValue({ value: null });
    vi.mocked(App.getInfo).mockResolvedValue(appInfo);

    const wrapper = mount(HomePage, {
      global: {
        stubs: globalStubs,
      },
    });

    await flushPromises();

    const firstDigit = getDigitButton(wrapper, "1");
    expect(firstDigit).toBeTruthy();
    await firstDigit!.trigger("click");

    const idButtons = wrapper.findAll('button[aria-label="id number"]');
    expect(idButtons[0].text().trim()).toBe("1");

    await idButtons[0].trigger("click");

    const backspaceButton = wrapper.find('button[aria-label="backspace"]');
    await backspaceButton.trigger("click");

    const updatedButtons = wrapper.findAll('button[aria-label="id number"]');
    expect(updatedButtons[0].text().trim()).toBe("•");
  });
});
