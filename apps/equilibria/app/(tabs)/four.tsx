import { ExternalLink } from "@tamagui/lucide-icons";
import { Anchor, H2, Paragraph, XStack, YStack } from "tamagui";
import { ToastControl } from "@/app/CurrentToast";
import { SignIn } from "../SignIn";
import { Authenticated, Unauthenticated } from "convex/react";

export default function TabFourScreen() {
  return (
    <YStack
      flex={1}
      items="center"
      gap="$8"
      px="$10"
      pt="$5"
      bg="$background"
    ></YStack>
  );
}
