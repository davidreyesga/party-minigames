import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, glow, radius } from "../../theme/tokens";

const TAB_LABELS: Record<string, string> = {
  Home: "Home",
  Lobby: "Lobby",
  Games: "Juegos",
  Settings: "Ajustes",
};

const TAB_MARKS: Record<string, string> = {
  Home: "H",
  Lobby: "L",
  Games: "J",
  Settings: "A",
};

export default function AppTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const options = descriptors[route.key]?.options;
          const focused = state.index === index;
          const label = TAB_LABELS[route.name] ?? route.name;
          const mark = TAB_MARKS[route.name] ?? label[0] ?? "?";

          const onPress = () => {
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: "tabPress",
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              target: route.key,
              type: "tabLongPress",
            });
          };

          return (
            <Pressable
              accessibilityLabel={options?.tabBarAccessibilityLabel ?? label}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              key={route.key}
              onLongPress={onLongPress}
              onPress={onPress}
              style={({ pressed }) => [
                styles.item,
                focused ? styles.itemActive : styles.itemIdle,
                pressed ? styles.itemPressed : null,
              ]}
              testID={options?.tabBarButtonTestID}
            >
              <View style={[styles.activeRail, focused ? styles.activeRailOn : styles.activeRailOff]} />
              <View style={[styles.mark, focused ? styles.markActive : styles.markIdle]}>
                <Text style={[styles.markText, focused ? styles.textActive : styles.textIdle]}>
                  {mark}
                </Text>
              </View>
              <Text
                numberOfLines={1}
                style={[styles.label, focused ? styles.textActive : styles.textIdle]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  bar: {
    backgroundColor: colors.glassFillStrong,
    borderColor: colors.innerBorder,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    minHeight: 72,
    padding: 8,
    shadowColor: glow.primary.color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: glow.primary.radius,
    elevation: 10,
  },
  item: {
    alignItems: "center",
    borderRadius: radius.md,
    flex: 1,
    justifyContent: "center",
    minHeight: 56,
    overflow: "hidden",
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  itemActive: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.cyanDim,
    borderWidth: 1,
    shadowColor: glow.cyan.color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: glow.cyan.radius,
    elevation: 5,
  },
  itemIdle: {
    borderColor: "transparent",
    borderWidth: 1,
  },
  itemPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  activeRail: {
    height: 3,
    left: 18,
    position: "absolute",
    right: 18,
    top: 0,
  },
  activeRailOn: {
    backgroundColor: colors.cyan,
    borderRadius: radius.pill,
  },
  activeRailOff: {
    backgroundColor: "transparent",
  },
  mark: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  markActive: {
    backgroundColor: colors.cyan,
  },
  markIdle: {
    backgroundColor: colors.surfaceContainer,
  },
  markText: {
    fontSize: 12,
    fontWeight: "900",
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },
  textActive: {
    color: colors.onCyan,
  },
  textIdle: {
    color: colors.textMuted,
  },
});
