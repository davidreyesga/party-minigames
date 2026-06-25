import { useState } from "react";
import { Text, View } from "react-native";

import GameShell from "../../../components/game/GameShell";
import Card from "../../../components/ui/Card";
import GameBadge from "../../../components/ui/GameBadge";
import SegmentedControl, { type SegmentedOption } from "../../../components/ui/SegmentedControl";
import { colors } from "../../../theme/tokens";
import { heavyTap } from "../../../utils/haptics";
import type { GameComponentProps } from "../game.registry";

import {
  DARES_BY_LEVEL,
  normalizeRouletteLevel,
  pickNextDare,
  type RouletteLevel,
} from "./dares";

const LEVEL_OPTIONS: readonly SegmentedOption<RouletteLevel>[] = [
  { key: "suave", label: "Suave", color: colors.cyanDim },
  { key: "medio", label: "Medio", color: colors.primaryContainer },
  { key: "intenso", label: "Intenso", color: colors.pink },
  { key: "extremo", label: "Extremo", color: colors.warning },
];

export default function RouletteGame(props: GameComponentProps) {
  const [level, setLevel] = useState<RouletteLevel>(() => normalizeRouletteLevel(props.defaultLevel));
  const [result, setResult] = useState<string | null>(null);
  const [lastDare, setLastDare] = useState<string | undefined>();

  const handlePrimaryPress = () => {
    if (!props.hasPlayers) {
      props.onPrimaryPress();
      return;
    }

    if (!result) {
      const nextDare = pickNextDare(DARES_BY_LEVEL[level], lastDare);
      heavyTap();
      setResult(nextDare);
      setLastDare(nextDare);
      props.pauseTimer();
      return;
    }

    setResult(null);
    props.restartTimer();
    props.onPrimaryPress();
  };

  const playerName = props.currentPlayer?.name ?? "El jugador actual";
  const penaltySuggestion = `Si no cumple, aplica hasta ${props.roundCap} en modo ${props.penaltyMode}.`;

  const game = {
    ...props.game,
    prompt: {
      ...props.game.prompt,
      title: result ? "Reto listo" : "Prepara la ruleta",
      text: result
        ? `${playerName}: ${result} ${penaltySuggestion}`
        : `${playerName}, elige un nivel y gira la ruleta para recibir un reto.`,
      emptyText: "Agrega jugadores al lobby para activar la ruleta por nivel.",
      footnote: result
        ? "Cumple el reto o aplica la penalizacion acordada antes de avanzar."
        : "Puedes cambiar el nivel antes de cada giro.",
    },
  };

  const gameContent = (
    <Card className="p-5" glow>
      <GameBadge label={result ? "resultado" : "selecciona nivel"} tone={result ? "success" : "primary"} selected />

      <View className="mt-4">
        <SegmentedControl
          disabled={!props.hasPlayers || Boolean(result)}
          onChange={setLevel}
          options={LEVEL_OPTIONS}
          value={level}
        />
      </View>

      {result ? (
        <View className="mt-5 items-center">
          <GameBadge label={`nivel ${level}`} tone={level === "extremo" ? "warning" : "pink"} selected />
          <Text className="mt-4 text-center text-2xl font-extrabold leading-8" style={{ color: colors.text }}>
            {result}
          </Text>
          <Text className="mt-3 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
            {penaltySuggestion}
          </Text>
        </View>
      ) : (
        <Text className="mt-4 text-sm leading-5" style={{ color: colors.textMuted }}>
          Nivel actual: {level}. Presiona GIRAR RULETA para elegir un reto al azar.
        </Text>
      )}
    </Card>
  );

  return (
    <GameShell
      {...props}
      game={game}
      gameContent={gameContent}
      onPrimaryPress={handlePrimaryPress}
      primaryActionLabel={!props.hasPlayers ? "INICIAR RONDA" : result ? "SIGUIENTE TURNO" : "GIRAR RULETA"}
    />
  );
}
