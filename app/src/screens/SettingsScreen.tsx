import { Pressable, Text, TextInput, View } from "react-native";

import {
  type DareLevel,
  type PenaltyMode,
  useSettingsStore,
} from "../store/settings.store";

import Card from "../components/ui/Card";
import GameBadge from "../components/ui/GameBadge";
import Header from "../components/ui/Header";
import Screen from "../components/ui/Screen";
import SegmentedControl from "../components/ui/SegmentedControl";
import { colors, glow, levelColors, radius } from "../theme/tokens";

const PENALTY_OPTIONS = [
  { key: "sorbos", label: "Sorbos", color: colors.cyan },
  { key: "shots", label: "Shots", color: colors.pink },
  { key: "puntos", label: "Puntos", color: colors.success },
] as const;

const LEVEL_OPTIONS = [
  { key: "suave", label: "Suave", color: levelColors.suave.base },
  { key: "medio", label: "Medio", color: levelColors.medio.base },
  { key: "intenso", label: "Intenso", color: levelColors.intenso.base },
  { key: "extremo", label: "Extremo", color: levelColors.extremo.base },
] as const;

const TIMER_ROWS = [
  ["rapidCategory", "Categoria", "Pensar rapido bajo presion.", colors.pink],
  ["rhymes", "Rimas", "Mantener la cadena sin repetir.", colors.cyan],
  ["sequence", "Secuencia", "Recordar el patron de la mesa.", colors.primary],
  ["impostorQnA", "Impostor", "Tiempo privado de pregunta.", colors.warning],
] as const;

const READY_SPOTS = [
  ["Modo sin alcohol", "Preparado para una unidad alternativa.", colors.success],
  ["Sonidos", "Listo para senales de ronda y timer.", colors.pink],
] as const;

function SectionTitle({
  eyebrow,
  title,
  subtitle,
  badge,
  tone = "cyan",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
  tone?: "primary" | "cyan" | "pink" | "success" | "warning" | "neutral";
}) {
  return (
    <View className="flex-row items-start justify-between gap-3">
      <View className="flex-1">
        <Text className="text-[10px] font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
          {eyebrow}
        </Text>
        <Text className="mt-2 text-xl font-extrabold leading-7" style={{ color: colors.text }}>
          {title}
        </Text>
        <Text className="mt-1 text-sm leading-5" style={{ color: colors.textMuted }}>
          {subtitle}
        </Text>
      </View>
      {badge ? <GameBadge label={badge} tone={tone} selected /> : null}
    </View>
  );
}

function LevelRow({
  label,
  color,
  active = false,
}: {
  label: string;
  color: { base: string; glow: string };
  active?: boolean;
}) {
  return (
    <View
      className="flex-row items-center justify-between px-3 py-3"
      style={{
        backgroundColor: active ? colors.surfaceHigh : colors.surfaceLow,
        borderColor: active ? color.base : colors.innerBorder,
        borderRadius: radius.default,
        borderWidth: 1,
      }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-3 w-3"
          style={{
            backgroundColor: color.base,
            borderRadius: radius.pill,
            shadowColor: color.glow,
            shadowOpacity: active ? 0.55 : 0.25,
            shadowRadius: active ? 10 : 5,
            shadowOffset: { width: 0, height: 0 },
            elevation: active ? 6 : 2,
          }}
        />
        <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
          {label}
        </Text>
      </View>
      <View
        className="h-2 w-16 overflow-hidden"
        style={{
          backgroundColor: colors.surfaceContainer,
          borderRadius: radius.pill,
        }}
      >
        <View
          className="h-full"
          style={{
            backgroundColor: color.base,
            borderRadius: radius.pill,
            width: active ? "100%" : "42%",
          }}
        />
      </View>
    </View>
  );
}

function TimerRow({
  label,
  description,
  value,
  accent,
  onChangeText,
}: {
  label: string;
  description: string;
  value: number;
  accent: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View
      className="flex-row items-center justify-between gap-3 px-3 py-3"
      style={{
        backgroundColor: colors.surfaceLow,
        borderColor: colors.innerBorder,
        borderRadius: radius.default,
        borderWidth: 1,
      }}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <View className="h-2.5 w-2.5" style={{ backgroundColor: accent, borderRadius: radius.pill }} />
          <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
            {label}
          </Text>
        </View>
        <Text className="mt-1 text-xs leading-4" style={{ color: colors.textMuted }}>
          {description}
        </Text>
      </View>

      <TextInput
        accessibilityLabel={`Timer ${label}`}
        keyboardType="number-pad"
        maxLength={3}
        onChangeText={onChangeText}
        selectTextOnFocus
        value={String(value)}
        className="h-12 w-20 px-3 text-center text-lg font-extrabold"
        style={{
          backgroundColor: colors.surfaceContainer,
          borderColor: accent,
          borderRadius: radius.pill,
          borderWidth: 1,
          color: accent,
          shadowColor: accent,
          shadowOpacity: 0.18,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 0 },
          elevation: 3,
        }}
      />
    </View>
  );
}

function FutureSettingRow({
  label,
  description,
  accent,
}: {
  label: string;
  description: string;
  accent: string;
}) {
  return (
    <View
      className="flex-row items-center justify-between gap-3 px-3 py-3"
      style={{
        backgroundColor: colors.surfaceLow,
        borderColor: colors.innerBorder,
        borderRadius: radius.default,
        borderWidth: 1,
        opacity: 0.88,
      }}
    >
      <View className="flex-1">
        <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
          {label}
        </Text>
        <Text className="mt-1 text-xs leading-4" style={{ color: colors.textMuted }}>
          {description}
        </Text>
      </View>

      <View
        className="h-8 min-w-[92px] items-center justify-center border px-3"
        style={{
          backgroundColor: colors.surfaceContainer,
          borderColor: accent,
          borderRadius: radius.pill,
        }}
      >
        <Text className="text-[10px] font-extrabold tracking-widest" style={{ color: accent }}>
          PROXIMO
        </Text>
      </View>
    </View>
  );
}

function HapticsSettingRow({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  const accent = enabled ? colors.success : colors.outline;

  return (
    <Pressable
      accessibilityLabel="Activar vibracion tactil"
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      onPress={() => onToggle(!enabled)}
      className="flex-row items-center justify-between gap-3 px-3 py-3"
      style={({ pressed }) => ({
        backgroundColor: colors.surfaceLow,
        borderColor: enabled ? colors.success : colors.innerBorder,
        borderRadius: radius.default,
        borderWidth: 1,
        opacity: pressed ? 0.86 : 1,
      })}
    >
      <View className="flex-1">
        <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
          Vibracion tactil
        </Text>
        <Text className="mt-1 text-xs leading-4" style={{ color: colors.textMuted }}>
          Feedback suave en selecciones, avances y resultados importantes.
        </Text>
      </View>

      <View
        className="h-8 min-w-[92px] items-center justify-center border px-3"
        style={{
          backgroundColor: enabled ? colors.surfaceHigh : colors.surfaceContainer,
          borderColor: accent,
          borderRadius: radius.pill,
        }}
      >
        <Text className="text-[10px] font-extrabold tracking-widest" style={{ color: accent }}>
          {enabled ? "ACTIVA" : "OFF"}
        </Text>
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const penaltyMode = useSettingsStore((s) => s.penaltyMode);
  const roundCap = useSettingsStore((s) => s.roundCap);
  const defaultLevel = useSettingsStore((s) => s.defaultLevel);
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);
  const timers = useSettingsStore((s) => s.timers);

  const setPenaltyMode = useSettingsStore((s) => s.setPenaltyMode);
  const setRoundCap = useSettingsStore((s) => s.setRoundCap);
  const setDefaultLevel = useSettingsStore((s) => s.setDefaultLevel);
  const setHapticsEnabled = useSettingsStore((s) => s.setHapticsEnabled);
  const setTimer = useSettingsStore((s) => s.setTimer);

  return (
    <Screen scroll>
      <Header
        title="Control Deck"
        subtitle="Ajusta la energia, el ritmo y los limites de la partida."
      />

      <View className="gap-4 pb-3">
        <Card className="p-5" glow>
          <SectionTitle
            badge={penaltyMode}
            eyebrow="MODO DE PENALIZACION"
            subtitle="La unidad se usa como etiqueta de la ronda: sorbos, shots o puntos."
            title="Define la consecuencia."
            tone="warning"
          />

          <View className="mt-5">
            <SegmentedControl
              onChange={setPenaltyMode}
              options={PENALTY_OPTIONS}
              value={penaltyMode}
            />
          </View>
        </Card>

        <Card className="p-5">
          <SectionTitle
            badge={`${roundCap} max`}
            eyebrow="TOPE POR RONDA"
            subtitle="Mantiene la partida intensa sin dejar que una ronda se pase de la raya."
            title="Limite compacto."
            tone="cyan"
          />

          <View
            className="mt-5 flex-row items-center gap-3 px-4 py-3"
            style={{
              backgroundColor: colors.surfaceLow,
              borderColor: colors.innerBorder,
              borderRadius: radius.default,
              borderWidth: 1,
            }}
          >
            <View className="flex-1">
              <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
                Unidades maximas
              </Text>
              <Text className="mt-1 text-xs leading-4" style={{ color: colors.textMuted }}>
                Recomendado: mantenerlo bajo para ritmo rapido.
              </Text>
            </View>
            <TextInput
              accessibilityLabel="Tope por ronda"
              keyboardType="number-pad"
              maxLength={2}
              onChangeText={(text) => {
                const nextValue = Number(text.replace(/[^\d]/g, ""));
                setRoundCap(Number.isFinite(nextValue) ? nextValue : 0);
              }}
              placeholder="3"
              placeholderTextColor={colors.outline}
              selectTextOnFocus
              value={String(roundCap)}
              className="h-14 w-24 px-4 text-center text-2xl font-extrabold"
              style={{
                backgroundColor: colors.surfaceContainer,
                borderColor: colors.cyanDim,
                borderRadius: radius.pill,
                borderWidth: 1,
                color: colors.cyan,
                shadowColor: glow.cyan.color,
                shadowOpacity: 0.18,
                shadowRadius: glow.cyan.radius,
                shadowOffset: { width: 0, height: 0 },
                elevation: 4,
              }}
            />
          </View>
        </Card>

        <Card className="p-5">
          <SectionTitle
            badge={defaultLevel}
            eyebrow="NIVEL POR DEFECTO"
            subtitle="El nivel inicial marca el tono cuando un juego permite intensidad."
            title="Elige el pulso base."
            tone="primary"
          />

          <View className="mt-5">
            <SegmentedControl
              onChange={setDefaultLevel}
              options={LEVEL_OPTIONS}
              value={defaultLevel}
            />
          </View>

          <View className="mt-4 gap-2">
            <LevelRow active={defaultLevel === "suave"} label="Suave" color={levelColors.suave} />
            <LevelRow active={defaultLevel === "medio"} label="Medio" color={levelColors.medio} />
            <LevelRow active={defaultLevel === "intenso"} label="Intenso" color={levelColors.intenso} />
            <LevelRow active={defaultLevel === "extremo"} label="Extremo" color={levelColors.extremo} />
          </View>
        </Card>

        <Card className="p-5">
          <SectionTitle
            badge="segundos"
            eyebrow="TIMERS BASE"
            subtitle="Valores iniciales para juegos de velocidad, memoria y roles ocultos."
            title="Controla el ritmo."
            tone="pink"
          />

          <View className="mt-5 gap-3">
            {TIMER_ROWS.map(([key, label, description, accent]) => (
              <TimerRow
                accent={accent}
                description={description}
                key={key}
                label={label}
                onChangeText={(text) => setTimer(key, Number(text.replace(/[^\d]/g, "")))}
                value={timers[key]}
              />
            ))}
          </View>
        </Card>

        <Card className="p-5">
          <SectionTitle
            badge={hapticsEnabled ? "activa" : "off"}
            eyebrow="FEEDBACK TACTIL"
            subtitle="Controla las vibraciones cortas de acciones y resultados."
            title="Siente el ritmo."
            tone={hapticsEnabled ? "success" : "neutral"}
          />

          <View className="mt-5">
            <HapticsSettingRow enabled={hapticsEnabled} onToggle={setHapticsEnabled} />
          </View>
        </Card>

        <Card className="p-5">
          <SectionTitle
            eyebrow="PROXIMA CAPA"
            subtitle="Espacios reservados para preferencias que necesitan store propio."
            title="Listo para crecer."
            tone="success"
          />

          <View className="mt-5 gap-3">
            {READY_SPOTS.map(([label, description, accent]) => (
              <FutureSettingRow
                accent={accent}
                description={description}
                key={label}
                label={label}
              />
            ))}
          </View>
        </Card>

        <Card className="p-5">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text className="text-base font-extrabold" style={{ color: colors.text }}>
                Uso responsable
              </Text>
              <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
                +18. Consentimiento primero. Pueden jugar con puntos o retos sin alcohol cuando el grupo lo prefiera.
              </Text>
            </View>
            <GameBadge label="cuidado" tone="success" selected />
          </View>
        </Card>
      </View>
    </Screen>
  );
}
