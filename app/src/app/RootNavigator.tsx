import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { RootStackParamList } from "./navigation.types";

import HomeScreen from "../screens/HomeScreen";
import LobbyScreen from "../screens/LobbyScreen";
import SettingsScreen from "../screens/SettingsScreen";
import GamesScreen from "../screens/GamesScreen";
import GameScreen from "../screens/GameScreen"; 

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Party Minigames" }}
        />
        <Stack.Screen
          name="Lobby"
          component={LobbyScreen}
          options={{ title: "Lobby" }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Ajustes" }}
        />
        <Stack.Screen
          name="Games"
          component={GamesScreen}
          options={{ title: "Juegos" }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: "Juego" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}