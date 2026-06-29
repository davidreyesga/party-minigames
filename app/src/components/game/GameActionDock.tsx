import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, glow, spacing } from "../../theme/tokens";

import { PrimaryButtonGiant, SecondaryButton } from "../ui/Button";

export const GAME_ACTION_DOCK_SCROLL_PADDING = 188;

type Props = {
  primaryLabel: string;
  primaryDisabled?: boolean;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

export default function GameActionDock({
  primaryLabel,
  primaryDisabled = false,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
}: Props) {
  const insets = useSafeAreaInsets();
  const secondaryAction =
    secondaryLabel && onSecondaryPress
      ? { label: secondaryLabel, onPress: onSecondaryPress }
      : null;

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        <PrimaryButtonGiant
          disabled={primaryDisabled}
          label={primaryLabel}
          onPress={onPrimaryPress}
        />
        {secondaryAction ? (
          <SecondaryButton label={secondaryAction.label} onPress={secondaryAction.onPress} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
  },
  dock: {
    backgroundColor: colors.glassFillStrong,
    borderColor: colors.innerBorder,
    borderTopWidth: 1,
    gap: 10,
    paddingHorizontal: spacing.safeMargin,
    paddingTop: 12,
    shadowColor: glow.primary.color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: glow.primary.radius,
    elevation: 16,
  },
});
