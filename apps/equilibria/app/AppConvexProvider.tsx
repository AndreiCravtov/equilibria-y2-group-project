import { Platform } from "react-native";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import * as SecureStore from "expo-secure-store";
import { env } from "@/env";
import { ReactNode } from "react";

const convex = new ConvexReactClient(env.EXPO_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

export function AppConvexProvider({ children }: { children: ReactNode }) {
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
