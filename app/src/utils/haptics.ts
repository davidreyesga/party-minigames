import * as Haptics from "expo-haptics";

import { useSettingsStore } from "../store/settings.store";

type HapticAction = () => Promise<void>;

async function runHaptic(action: HapticAction) {
  if (!useSettingsStore.getState().hapticsEnabled) {
    return;
  }

  try {
    await action();
  } catch {
    // Haptics can be unavailable on web, simulators, or unsupported devices.
  }
}

export function lightTap() {
  void runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export function mediumTap() {
  void runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

export function heavyTap() {
  void runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
}

export function successTap() {
  void runHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

export function warningTap() {
  void runHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
}

export function errorTap() {
  void runHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}
