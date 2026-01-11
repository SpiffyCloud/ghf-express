import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import BackgroundVisuals from "@/components/BackgroundVisuals.vue";
import IconButton from "@/components/IconButton.vue";
import SpiffyLink from "@/components/SpiffyLink.vue";

describe("BackgroundVisuals", () => {
  it("renders two svg elements", () => {
    const wrapper = mount(BackgroundVisuals);
    expect(wrapper.findAll("svg")).toHaveLength(2);
  });
});

describe("IconButton", () => {
  it("emits click events", async () => {
    const wrapper = mount(IconButton, {
      props: { ariaLabel: "save" },
      slots: { default: "Save" },
    });

    await wrapper.trigger("click");

    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("respects disabled state", () => {
    const wrapper = mount(IconButton, {
      props: { ariaLabel: "save", disabled: true },
    });

    expect(wrapper.attributes("disabled")).toBeDefined();
  });
});

describe("SpiffyLink", () => {
  it("links to the repo", () => {
    const wrapper = mount(SpiffyLink);
    const link = wrapper.get("a");

    expect(link.attributes("href")).toBe(
      "https://github.com/SpiffyCloud/ghf-express",
    );
    expect(link.attributes("target")).toBe("_blank");
  });
});
