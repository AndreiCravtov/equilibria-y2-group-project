import "@/tamagui-web.css";

import { Platform } from "react-native";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import * as SecureStore from "expo-secure-store";
import { env } from "@/env";
import { ReactNode } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider, useTheme, type TamaguiProviderProps } from "tamagui";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { CurrentToast } from "./CurrentToast";
import { tamaguiConfig } from "@/tamagui.config";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { LoadingView } from "@/components/Loading";

// ----------------------------- CONVEX SETUP START -----------------------------
const convex = new ConvexReactClient(env.EXPO_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

function AppConvexProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider
      client={convex}
      storage={(() => {
        switch (Platform.OS) {
          case "android":
            return secureStorage;
          case "ios":
            throw new Error("IOS secure storage not configured yet");
          default:
            throw new Error(`Unsupported platform: ${Platform.OS}`);
        }
      })()}
    >
      {children}
    </ConvexAuthProvider>
  );
}
// ----------------------------- CONVEX SETUP END -----------------------------

// ----------------------------- TAMAGUI SETUP START -----------------------------
export function AppTamaguiProvider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, "config">) {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      defaultTheme={colorScheme === "dark" ? "dark" : "light"}
      {...rest}
    >
      <ToastProvider
        swipeDirection="horizontal"
        duration={6000}
        native={[
          // uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go
          "mobile",
        ]}
      >
        {children}
        <CurrentToast />
        <ToastViewport top="$8" left={0} right={0} />
      </ToastProvider>
    </TamaguiProvider>
  );
}
// ----------------------------- TAMAGUI SETUP END -----------------------------

// ----------------------------- LAYOUT SETUP START -----------------------------
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <AppConvexProvider>
      <AppTamaguiProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <RootLayoutNav />
        </ThemeProvider>
      </AppTamaguiProvider>
    </AppConvexProvider>
  );
}

export const unstable_settings = {
  initialRouteName: "(protected)", // anchor
};

function RootLayoutNav() {
  // Ensure is authenticated
  const auth = useConvexAuth();
  if (auth.isLoading) return <LoadingView />;

  return (
    <Stack>
      {/* If not authenticated, take me to this section of the app */}
      <Stack.Protected guard={!auth.isAuthenticated}>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>

      {/* Otherwise proceed to the main app */}
      <Stack.Protected guard={auth.isAuthenticated}>
        <Stack.Screen
          name="(protected)"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
// ----------------------------- LAYOUT SETUP END -----------------------------
