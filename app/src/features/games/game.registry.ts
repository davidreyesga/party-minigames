import type { ComponentProps, ComponentType } from "react";

import type { GameId } from "../../app/navigation.types";
import GameShell from "../../components/game/GameShell";

import ImpostorGame from "./impostor/ImpostorGame";
import MostLikelyGame from "./most-likely/MostLikelyGame";
import RapidCategoryGame from "./rapid-category/RapidCategoryGame";
import RhymesGame from "./rhymes/RhymesGame";
import RouletteGame from "./roulette/RouletteGame";
import SequenceGame from "./sequence/SequenceGame";
import SlowFingerGame from "./slow-finger/SlowFingerGame";
import WouldYouRatherGame from "./would-you-rather/WouldYouRatherGame";

export type GameComponentProps = ComponentProps<typeof GameShell>;
export type GameComponent = ComponentType<GameComponentProps>;

export const GAME_REGISTRY: Record<GameId, GameComponent> = {
  roulette: RouletteGame,
  wouldYouRather: WouldYouRatherGame,
  rapidCategory: RapidCategoryGame,
  slowFinger: SlowFingerGame,
  impostor: ImpostorGame,
  rhymes: RhymesGame,
  sequence: SequenceGame,
  mostLikely: MostLikelyGame,
};

export function getGameComponent(gameId: string): GameComponent | undefined {
  if (!Object.prototype.hasOwnProperty.call(GAME_REGISTRY, gameId)) {
    return undefined;
  }

  return GAME_REGISTRY[gameId as GameId];
}
