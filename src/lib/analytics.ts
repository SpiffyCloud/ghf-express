import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import { Capacitor } from '@capacitor/core';

type AnalyticsEvent = 'barcode_displayed' | 'barcode_deleted' | 'barcode_edited' | 'app_shared';

export async function trackEvent(name: AnalyticsEvent) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await FirebaseAnalytics.logEvent({ name });
  } catch {
    // Ignore logging failures.
  }
}
