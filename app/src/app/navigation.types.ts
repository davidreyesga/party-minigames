export type GameId =
  | "roulette"
  | "wouldYouRather"
  | "rapidCategory"
  | "slowFinger"
  | "impostor"
  | "rhymes"
  | "sequence"
  | "mostLikely";

export type RootStackParamList = {
  Home: undefined;
  Lobby: undefined;
  Settings: undefined;
  Games: undefined;
  Game: { gameId: GameId };
};