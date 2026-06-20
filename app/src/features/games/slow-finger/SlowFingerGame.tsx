import GameShell from "../../../components/game/GameShell";
import type { GameComponentProps } from "../game.registry";

export default function SlowFingerGame(props: GameComponentProps) {
  return <GameShell {...props} />;
}
