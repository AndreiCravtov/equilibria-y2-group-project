import { Canvas } from "@shopify/react-native-skia";
import Animated from "react-native-reanimated";
import { YStack } from "tamagui";
import Svg, { Path } from "react-native-svg";

export default {
  tamagui: {
    YStack: Animated.createAnimatedComponent(YStack),
  },
  svg: {
    Svg: Animated.createAnimatedComponent(Svg),
    Path: Animated.createAnimatedComponent(Path),
  },
};
