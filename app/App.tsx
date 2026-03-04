import "./global.css";

import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/app/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}