import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { ComponentType } from "react";

import type { MainTabParamList } from "./navigation.types";

import AppTabBar from "../components/navigation/AppTabBar";
import GamesScreen from "../screens/GamesScreen";
import HomeScreen from "../screens/HomeScreen";
import LobbyScreen from "../screens/LobbyScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { colors } from "../theme/tokens";

const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeTab = HomeScreen as ComponentType<any>;
const LobbyTab = LobbyScreen as ComponentType<any>;
const GamesTab = GamesScreen as ComponentType<any>;
const SettingsTab = SettingsScreen as ComponentType<any>;

export default function MainTabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{ tabBarAccessibilityLabel: "Home" }}
      />
      <Tab.Screen
        name="Lobby"
        component={LobbyTab}
        options={{ tabBarAccessibilityLabel: "Lobby" }}
      />
      <Tab.Screen
        name="Games"
        component={GamesTab}
        options={{ tabBarAccessibilityLabel: "Juegos" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsTab}
        options={{ tabBarAccessibilityLabel: "Ajustes" }}
      />
    </Tab.Navigator>
  );
}
