import { useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import type { GameId, RootStackParamList } from "../app/navigation.types";
import { useSessionStore } from "../store/session.store";
import { useSettingsStore } from "../store/settings.store";

import { PrimaryButtonGiant, SecondaryButton } from "../components/ui/Button";
import Card from "../components/ui/Card";
import GameBadge from "../components/ui/GameBadge";
import Header from "../components/ui/Header";
import PromptCard from "../components/ui/PromptCard";
import RulesModal from "../components/ui/RulesModal";
import Screen from "../components/ui/Screen";
import TimerRing from "../components/ui/TimerRing";
import TurnCard from "../components/ui/TurnCard";
import { colors, radius } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;
type TimerKey = "rapidCategory" | "rhymes" | "sequence" | "impostorQnA";
type BadgeTone = "primary" | "cyan" | "pink" | "success" | "warning" | "neutral";

type GameShellMeta = {
  title: string;
  type: string;
  tone: BadgeTone;
  description: string;
  promptTitle: string;
  promptText: string;
  emptyPromptText: string;
  promptFootnote: string;
  timerKey: TimerKey;
  timerLabel: string;
  rules: readonly string[];
};

const GAME_SHELL: Record<GameId, GameShellMeta> = {
  roulette: {
    title: "Ruleta por nivel",
    type: "Azar",
    tone: "primary",
    description: "Reto social con intensidad escalable y resultado sorpresa.",
    promptTitle: "Preparar ruleta",
    promptText: "El jugador actual elige un nivel, gira la ruleta y acepta el reto que salga.",
    emptyPromptText: "Agrega jugadores al lobby para activar la ruleta de la ronda.",
    promptFootnote: "Shell temporal: aqui entraran niveles, giro y modal de resultado.",
    timerKey: "impostorQnA",
    timerLabel: "Setup",
    rules: [
      "El jugador del turno toma la decision principal.",
      "El grupo valida el reto antes de pasar al siguiente turno.",
      "La intensidad final usara el nivel por defecto como punto de partida.",
    ],
  },
  wouldYouRather: {
    title: "Que prefieres?",
    type: "Dilemas",
    tone: "cyan",
    description: "Dos opciones, una decision y debate rapido del grupo.",
    promptTitle: "Dilema listo",
    promptText: "Lee el dilema en voz alta, elige una opcion y deja que el grupo discuta la respuesta.",
    emptyPromptText: "Agrega jugadores para iniciar dilemas con turno visible.",
    promptFootnote: "Shell temporal: aqui entraran opciones, seleccion y expiracion.",
    timerKey: "impostorQnA",
    timerLabel: "Decision",
    rules: [
      "El jugador decide una de dos opciones.",
      "El grupo puede pedir una razon corta antes de avanzar.",
      "Los dilemas reales se conectaran en la siguiente fase.",
    ],
  },
  rapidCategory: {
    title: "Categoria relampago",
    type: "Rapidez",
    tone: "pink",
    description: "Pensar rapido antes de que el timer cierre la ronda.",
    promptTitle: "Categoria activa",
    promptText: "Di ejemplos validos de la categoria hasta que el tiempo termine o falles.",
    emptyPromptText: "Agrega jugadores para activar el timer de categoria.",
    promptFootnote: "Shell temporal: aqui entraran categorias, aciertos y fallo.",
    timerKey: "rapidCategory",
    timerLabel: "Categoria",
    rules: [
      "Responde antes de que termine el tiempo.",
      "No repitas respuestas dentro de la misma ronda.",
      "Cuando falle alguien, pasa el turno.",
    ],
  },
  slowFinger: {
    title: "Dedo mas lento",
    type: "Reflejos",
    tone: "warning",
    description: "Tension tactil para detectar quien reacciona ultimo.",
    promptTitle: "Todos atentos",
    promptText: "Todos colocan un dedo y esperan la senal; el ultimo en soltar pierde.",
    emptyPromptText: "Agrega jugadores antes de activar la ronda multitactil.",
    promptFootnote: "Shell temporal: aqui entrara deteccion multitouch real.",
    timerKey: "rapidCategory",
    timerLabel: "Senal",
    rules: [
      "Todos deben tocar la pantalla antes de iniciar.",
      "Nadie suelta hasta que aparezca la senal.",
      "El resultado real requiere pruebas fisicas multitouch.",
    ],
  },
  impostor: {
    title: "Impostor",
    type: "Roles ocultos",
    tone: "cyan",
    description: "Roles privados, palabra secreta y votacion final.",
    promptTitle: "Pasar telefono",
    promptText: "Pasa el telefono en secreto para revelar rol y preparar la discusion.",
    emptyPromptText: "Agrega jugadores para repartir roles sin filtrar informacion.",
    promptFootnote: "Shell temporal: aqui entraran fases, roles, palabra y votos.",
    timerKey: "impostorQnA",
    timerLabel: "Secreto",
    rules: [
      "Cada jugador mira su rol en privado.",
      "El impostor intenta mezclarse sin conocer la palabra completa.",
      "La votacion final decide si el grupo descubrio al impostor.",
    ],
  },
  rhymes: {
    title: "Rimas",
    type: "Creatividad",
    tone: "pink",
    description: "Cadena rapida de palabras sin repetir ni perder el ritmo.",
    promptTitle: "Palabra base",
    promptText: "Improvisa una rima valida antes de que el timer llegue a cero.",
    emptyPromptText: "Agrega jugadores para activar la cadena de rimas.",
    promptFootnote: "Shell temporal: aqui entraran palabra base, timer y evaluacion.",
    timerKey: "rhymes",
    timerLabel: "Rimas",
    rules: [
      "La rima debe ser aceptada por el grupo.",
      "No repitas palabras usadas en la ronda.",
      "Si dudas demasiado, pasa el turno con penalizacion.",
    ],
  },
  sequence: {
    title: "Secuencia",
    type: "Memoria",
    tone: "primary",
    description: "Memoria progresiva con patron cada vez mas exigente.",
    promptTitle: "Memoriza el patron",
    promptText: "Observa la secuencia, repitela en orden y preparate para el siguiente nivel.",
    emptyPromptText: "Agrega jugadores para iniciar la cadena de memoria.",
    promptFootnote: "Shell temporal: aqui entraran patron, input y feedback.",
    timerKey: "sequence",
    timerLabel: "Memoria",
    rules: [
      "Mira el patron completo antes de responder.",
      "Cada ronda puede agregar un paso nuevo.",
      "Un error corta la secuencia y pasa el turno.",
    ],
  },
  mostLikely: {
    title: "Mas probable",
    type: "Votacion",
    tone: "success",
    description: "Votacion social express para provocar historias del grupo.",
    promptTitle: "Pregunta al grupo",
    promptText: "Lean la pregunta y voten quien encaja mejor con la situacion.",
    emptyPromptText: "Agrega jugadores para que la votacion tenga candidatos.",
    promptFootnote: "Shell temporal: aqui entraran pregunta, votos y resultado.",
    timerKey: "impostorQnA",
    timerLabel: "Voto",
    rules: [
      "Cada persona vota por quien crea mas probable.",
      "El grupo puede pedir una explicacion corta al ganador.",
      "Las preguntas reales se conectaran por mazos.",
    ],
  },
};

function ConfigTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: BadgeTone;
}) {
  return (
    <View
      className="flex-1 px-3 py-3"
      style={{
        backgroundColor: colors.surfaceLow,
        borderColor: colors.innerBorder,
        borderRadius: radius.default,
        borderWidth: 1,
      }}
    >
      <GameBadge label={label} tone={tone} />
      <Text className="mt-3 text-lg font-extrabold" style={{ color: colors.text }}>
        {value}
      </Text>
    </View>
  );
}

export default function GameScreen({ route, navigation }: Props) {
  const { gameId } = route.params;
  const [rulesVisible, setRulesVisible] = useState(false);

  const players = useSessionStore((s) => s.players);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const nextPlayer = useSessionStore((s) => s.nextPlayer);

  const penaltyMode = useSettingsStore((s) => s.penaltyMode);
  const roundCap = useSettingsStore((s) => s.roundCap);
  const defaultLevel = useSettingsStore((s) => s.defaultLevel);
  const timers = useSettingsStore((s) => s.timers);

  const meta = GAME_SHELL[gameId];
  const current = players[currentIndex];
  const hasPlayers = players.length > 0;
  const timerSeconds = timers[meta.timerKey];

  return (
    <Screen scroll>
      <Header
        title={meta.title}
        subtitle={meta.description}
        onRulesPress={() => setRulesVisible(true)}
      />

      <View className="gap-4 pb-3">
        <Card className="p-4" glow>
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <GameBadge label={meta.type} tone={meta.tone} selected />
              <Text className="mt-4 text-xl font-extrabold leading-7" style={{ color: colors.text }}>
                Shell de partida
              </Text>
              <Text className="mt-1 text-sm leading-5" style={{ color: colors.textMuted }}>
                Base visual lista para conectar la mecanica real de este minijuego.
              </Text>
            </View>
            <GameBadge label={`${players.length} jugadores`} tone={hasPlayers ? "cyan" : "warning"} />
          </View>
        </Card>

        <TurnCard
          playerName={current?.name}
          playerColor={current?.color}
          subtitle={
            hasPlayers
              ? "Completa la instruccion temporal y avanza al siguiente turno."
              : "Agrega jugadores al lobby para iniciar una ronda real."
          }
        />

        {!hasPlayers ? (
          <Card className="p-5">
            <GameBadge label="sin jugadores" tone="warning" selected />
            <Text className="mt-4 text-xl font-extrabold" style={{ color: colors.text }}>
              La mesa todavia esta vacia.
            </Text>
            <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
              Vuelve al lobby y agrega al menos una persona para que el turno, el timer y las acciones
              tengan contexto.
            </Text>
          </Card>
        ) : null}

        <PromptCard
          footnote={meta.promptFootnote}
          text={hasPlayers ? meta.promptText : meta.emptyPromptText}
          title={meta.promptTitle}
        />

        <Card className="p-5">
          <View className="items-center">
            <GameBadge label="timer sugerido" tone="cyan" selected />
            <View className="mt-5">
              <TimerRing
                dangerThreshold={Math.max(3, Math.floor(timerSeconds / 3))}
                label={meta.timerLabel}
                seconds={timerSeconds}
                totalSeconds={timerSeconds}
              />
            </View>
            <Text className="mt-4 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
              Usa el valor actual del store para dejar preparada la futura cuenta regresiva.
            </Text>
          </View>
        </Card>

        <Card className="p-5">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
                CONFIGURACION ACTUAL
              </Text>
              <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
                Esta partida lee los ajustes globales sin duplicar estado.
              </Text>
            </View>
            <GameBadge label={meta.timerLabel} tone={meta.tone} />
          </View>

          <View className="mt-4 flex-row gap-2">
            <ConfigTile label="modo" tone="warning" value={penaltyMode} />
            <ConfigTile label="nivel" tone="primary" value={defaultLevel} />
          </View>
          <View className="mt-2 flex-row gap-2">
            <ConfigTile label="tope" tone="cyan" value={`${roundCap}`} />
            <ConfigTile label="timer" tone="pink" value={`${timerSeconds}s`} />
          </View>
        </Card>

        <View className="gap-3">
          <PrimaryButtonGiant
            label={hasPlayers ? "SIGUIENTE TURNO" : "INICIAR RONDA"}
            onPress={hasPlayers ? nextPlayer : () => navigation.navigate("Lobby")}
          />
          <SecondaryButton label="VOLVER AL CATALOGO" onPress={() => navigation.navigate("Games")} />
        </View>
      </View>

      <RulesModal
        onClose={() => setRulesVisible(false)}
        rules={meta.rules}
        title={`Reglas: ${meta.title}`}
        visible={rulesVisible}
      />
    </Screen>
  );
}
