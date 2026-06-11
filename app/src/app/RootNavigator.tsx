import { useEffect } from "react";
import { CommonActions, NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from "@react-navigation/native-stack";

import type { MainTabParamList, RootStackParamList } from "./navigation.types";

import MainTabsNavigator from "./MainTabsNavigator";
import GameScreen from "../screens/GameScreen";
import { colors } from "../theme/tokens";

const Stack = createNativeStackNavigator<RootStackParamList>();

type TabRouteName = keyof MainTabParamList;
type TabRedirectProps = NativeStackScreenProps<RootStackParamList, TabRouteName>;

function TabRedirect({ route, navigation }: TabRedirectProps) {
  useEffect(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "MainTabs", params: { screen: route.name } }],
      }),
    );
  }, [navigation, route.name]);

  return null;
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
        <Stack.Screen name="Game" component={GameScreen} />

        <Stack.Screen name="Home" component={TabRedirect} />
        <Stack.Screen name="Lobby" component={TabRedirect} />
        <Stack.Screen name="Games" component={TabRedirect} />
        <Stack.Screen name="Settings" component={TabRedirect} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
