import type { NavigatorScreenParams } from "@react-navigation/native";

export type GameId =
  | "roulette"
  | "wouldYouRather"
  | "rapidCategory"
  | "slowFinger"
  | "impostor"
  | "rhymes"
  | "sequence"
  | "mostLikely";

export type MainTabParamList = {
  Home: undefined;
  Lobby: undefined;
  Games: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Game: { gameId: GameId };

  // Compatibility aliases for screens that still type their props against the root stack.
  Home: undefined;
  Lobby: undefined;
  Games: undefined;
  Settings: undefined;
};
