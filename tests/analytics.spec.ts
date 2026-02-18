import { describe, expect, it, vi } from "vitest";

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: vi.fn(),
  },
}));

vi.mock("@capacitor-firebase/analytics", () => ({
  FirebaseAnalytics: {
    logEvent: vi.fn(),
  },
}));

describe("trackEvent", () => {
  it("does nothing on web", async () => {
    const { trackEvent } = await import("@/lib/analytics");
    const { Capacitor } = await import("@capacitor/core");
    const { FirebaseAnalytics } = await import("@capacitor-firebase/analytics");

    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

    await trackEvent("barcode_displayed");

    expect(FirebaseAnalytics.logEvent).not.toHaveBeenCalled();
  });

  it("swallows native logging failures", async () => {
    const { trackEvent } = await import("@/lib/analytics");
    const { Capacitor } = await import("@capacitor/core");
    const { FirebaseAnalytics } = await import("@capacitor-firebase/analytics");

    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    vi.mocked(FirebaseAnalytics.logEvent).mockRejectedValue(new Error("fail"));

    await expect(trackEvent("barcode_deleted")).resolves.toBeUndefined();
  });
});
