import { H3, H4, H6, Spinner, YStack } from "tamagui";

export function LoadingView() {
  return (
    <YStack
      width="100%"
      height="100%"
      flex={1}
      gap="$2"
      justify="center"
      items="center"
      bg="$background"
    >
      <Spinner size="large" color="$indigo10" />
      <H6>Loading...</H6>
    </YStack>
  );
}
