import { Pressable, Text, TextInput, View } from "react-native";

import {
  type DareLevel,
  type PenaltyMode,
  useSettingsStore,
} from "../store/settings.store";

import Screen from "../components/ui/Screen";
import Header from "../components/ui/Header";
import Card from "../components/ui/Card";
import { colors, levelColors, radius } from "../theme/tokens";

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { key: string; label: string }[];
  onChange: (key: string) => void;
}) {
  return (
    <View
      className="flex-row p-1"
      style={{
        backgroundColor: colors.surface2,
        borderColor: colors.border,
        borderWidth: 2,
        borderRadius: radius.pill,
      }}
    >
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            className="flex-1 items-center justify-center py-2"
            style={({ pressed }) => ({
              borderRadius: radius.pill,
              backgroundColor: active ? colors.surface : "transparent",
              borderWidth: active ? 1 : 0,
              borderColor: active ? colors.glow : "transparent",
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text
              className="text-xs font-extrabold tracking-wide"
              style={{ color: active ? colors.text : colors.textMuted }}
            >
              {o.label.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function LevelRow({
  label,
  color,
}: {
  label: string;
  color: { base: string; glow: string };
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-sm font-bold" style={{ color: colors.text }}>
        {label}
      </Text>
      <View
        className="h-3 w-10 rounded-full"
        style={{
          backgroundColor: color.base,
          shadowColor: color.glow,
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 6,
        }}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const penaltyMode = useSettingsStore((s) => s.penaltyMode);
  const roundCap = useSettingsStore((s) => s.roundCap);
  const defaultLevel = useSettingsStore((s) => s.defaultLevel);
  const timers = useSettingsStore((s) => s.timers);

  const setPenaltyMode = useSettingsStore((s) => s.setPenaltyMode);
  const setRoundCap = useSettingsStore((s) => s.setRoundCap);
  const setDefaultLevel = useSettingsStore((s) => s.setDefaultLevel);
  const setTimer = useSettingsStore((s) => s.setTimer);

  return (
    <Screen scroll>
      <Header
        title="Control Deck"
        subtitle="Ajusta nivel y tiempos para el estilo de tu grupo."
        onRulesPress={() => {}}
      />

      <Card className="p-4">
        <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
          MODO DE PENALIZACION
        </Text>
        <Text className="mt-2 text-xs leading-5" style={{ color: colors.textMuted }}>
          Unidad funciona como etiqueta: sorbos, shots o puntos.
        </Text>

        <View className="mt-3">
          <Segmented
            value={penaltyMode}
            options={[
              { key: "sorbos", label: "Sorbos" },
              { key: "shots", label: "Shots" },
              { key: "puntos", label: "Puntos" },
            ]}
            onChange={(k) => setPenaltyMode(k as PenaltyMode)}
          />
        </View>
      </Card>

      <View className="mt-4">
        <Card className="p-4">
          <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
            TOPE POR RONDA
          </Text>
          <TextInput
            value={String(roundCap)}
            onChangeText={(t) => {
              const n = Number(t.replace(/[^\d]/g, ""));
              setRoundCap(Number.isFinite(n) ? n : 0);
            }}
            keyboardType="number-pad"
            placeholder="3"
            placeholderTextColor={colors.textMuted}
            className="mt-3 px-4 py-3 text-base"
            style={{
              backgroundColor: colors.surface2,
              borderColor: colors.border,
              borderWidth: 2,
              borderRadius: radius.pill,
              color: colors.text,
            }}
          />
          <Text className="mt-2 text-xs" style={{ color: colors.textMuted }}>
            Recomendado: mantenerlo bajo para ritmo rapido.
          </Text>
        </Card>
      </View>

      <View className="mt-4">
        <Card className="p-4">
          <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
            NIVEL POR DEFECTO
          </Text>

          <View className="mt-3">
            <Segmented
              value={defaultLevel}
              options={[
                { key: "suave", label: "Suave" },
                { key: "medio", label: "Medio" },
                { key: "intenso", label: "Intenso" },
                { key: "extremo", label: "Extremo" },
              ]}
              onChange={(k) => setDefaultLevel(k as DareLevel)}
            />
          </View>

          <View className="mt-4 gap-2">
            <LevelRow label="Suave" color={levelColors.suave} />
            <LevelRow label="Medio" color={levelColors.medio} />
            <LevelRow label="Intenso" color={levelColors.intenso} />
            <LevelRow label="Extremo" color={levelColors.extremo} />
          </View>
        </Card>
      </View>

      <View className="mt-4">
        <Card className="p-4">
          <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
            TIMERS BASE (SEG)
          </Text>

          {(
            [
              ["rapidCategory", "Categoria relampago"],
              ["rhymes", "Rimas"],
              ["sequence", "Secuencia"],
              ["impostorQnA", "Impostor pregunta"],
            ] as const
          ).map(([key, label]) => (
            <View
              key={key}
              className="mt-3 flex-row items-center justify-between"
              style={{
                backgroundColor: colors.surface2,
                borderColor: colors.border,
                borderWidth: 2,
                borderRadius: radius.lg,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              <Text className="text-sm font-bold" style={{ color: colors.text }}>
                {label}
              </Text>
              <TextInput
                value={String(timers[key])}
                onChangeText={(t) => setTimer(key, Number(t.replace(/[^\d]/g, "")))}
                keyboardType="number-pad"
                className="w-16 px-3 py-2 text-center text-sm font-extrabold"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: radius.pill,
                  color: colors.glow,
                }}
              />
            </View>
          ))}

          <Text className="mt-3 text-xs" style={{ color: colors.textMuted }}>
            Haptics y audio se pueden sumar como toggle en la siguiente iteracion.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}
