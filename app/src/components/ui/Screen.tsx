import { ReactNode, useEffect, useRef } from "react";
import { Animated, Platform, ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, gradients, spacing } from "../../theme/tokens";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
};

const webScrollStyle =
  Platform.OS === "web"
    ? ({
        touchAction: "pan-y",
        WebkitOverflowScrolling: "touch",
      } as unknown as ViewStyle)
    : undefined;

function ElectricSocialBackdrop() {
  return (
    <View pointerEvents="none" style={styles.backdrop}>
      <View
        style={[
          styles.ambientGlow,
          {
            top: -180,
            right: -130,
            width: 340,
            height: 340,
            backgroundColor: gradients.ambient.purple,
          },
        ]}
      />
      <View
        style={[
          styles.ambientGlow,
          {
            top: 190,
            left: -180,
            width: 300,
            height: 300,
            backgroundColor: gradients.ambient.cyan,
          },
        ]}
      />
      <View
        style={[
          styles.ambientGlow,
          {
            bottom: -180,
            right: -160,
            width: 320,
            height: 320,
            backgroundColor: gradients.ambient.purple,
          },
        ]}
      />
    </View>
  );
}

export default function Screen({ children, scroll = false, padded = true }: Props) {
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(mountAnim, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [mountAnim]);

  const inner = (
    <Animated.View
      className={`${scroll ? "" : "flex-1"} ${padded ? "px-5 py-4" : ""}`}
      style={{
        opacity: mountAnim,
        transform: [
          {
            translateY: mountAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ElectricSocialBackdrop />
      {scroll ? (
        <ScrollView
          style={[styles.content, webScrollStyle]}
          contentContainerStyle={[styles.scrollContent, webScrollStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {inner}
        </ScrollView>
      ) : (
        <View style={[styles.content, webScrollStyle]}>{inner}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  ambientGlow: {
    position: "absolute",
    borderRadius: 999,
  },
});
