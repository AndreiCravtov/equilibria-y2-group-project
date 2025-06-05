import { ExternalLink } from "@tamagui/lucide-icons";
import { Anchor, H2, Paragraph, XStack, YStack, useTheme } from "tamagui";
import { ToastControl } from "@/app/CurrentToast";
import { SignIn } from "../SignIn";
import { Authenticated, Unauthenticated } from "convex/react";
import Animated, {
  useSharedValue,
  useFrameCallback,
  Easing as ReanimatedEasing,
  useDerivedValue as useReanimatedDerivedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import AppAnimated from "@/components/app-animated";
import {
  Canvas,
  Path,
  Skia,
  Text as SkiaText,
  Group,
  SkFont,
  SkTypeface,
  FontWeight,
  FontWidth,
  FontSlant,
} from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";
import CustomDropletIcon from "@/components/CustomDropletIcon";
import { Pressable, View } from "react-native";

const WAVE_HEIGHT = 30; // Amplitude of the wave - Made shallower
const WAVE_SPEED = 0.005; // Speed of the wave animation - Made slower
const WATER_COLOR = "#0077FF"; // Blue color for the water

const ICON_PATH_DATA =
  "M 7,0 C 6.5,2.5 5,4.9 3,6.5 1,8.1 0,10 0,12 a 7,7 0 0 0 7,7 7,7 0 0 0 7,-7 C 14,10 13,8.1 11,6.5 9,4.9 7.5,2.5 7,0 Z m 0,8.320312 a 0.83990323,0.83990323 0 0 1 0.839844,0.839844 v 2.03711 h 2.037109 a 0.83990323,0.83990323 0 0 1 0.837891,0.83789 0.83990323,0.83990323 0 0 1 -0.837891,0.84375 H 7.839844 v 2.033203 A 0.83990323,0.83990323 0 0 1 7,15.755859 0.83990323,0.83990323 0 0 1 6.160156,14.912109 V 12.878906 H 4.1230469 a 0.83990323,0.83990323 0 0 1 -0.8398438,-0.84375 0.83990323,0.83990323 0 0 1 0.8398438,-0.83789 H 6.160156 V 9.160156 A 0.83990323,0.83990323 0 0 1 7,8.320312 Z";

interface TestAnimatedProps {
  percentage: number; // 0 to 100, represents how full the water level is
  yPad: number; // Percentage of parent height for top/bottom padding
  mainText?: string;
  mainTextSize?: number;
  themedMainTextColor?: string;
  mainTextColorUnderWater?: string;
  subText?: string;
  subTextSize?: number;
  themedSubTextColor?: string;
  subTextColorUnderWater?: string;
  showIcon?: boolean;
  iconSize?: number;
  iconColorAboveWater?: string;
  iconColorUnderWater?: string;
  iconCenterYFactor?: number;
  onIconPress?: () => void;
}

// Create an animated version of Pressable for Reanimated styles
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TestAnimated = ({
  percentage,
  yPad,
  mainText = "1.800ml",
  mainTextSize = 60,
  themedMainTextColor = "#000000",
  mainTextColorUnderWater = "#FFFFFF",
  subText = "Remaining 600ml",
  subTextSize = 18,
  themedSubTextColor = "#333333",
  subTextColorUnderWater = "#FFFFFF",
  showIcon = true,
  iconSize = 50, // Adjusted default icon size
  iconColorAboveWater = "#1E3A8A",
  iconColorUnderWater = "#FFFFFF",
  iconCenterYFactor = 0.78, // Default vertical center for the icon (78% from top)
  onIconPress = () => {
    console.log("Default Icon Pressed!");
  },
}: TestAnimatedProps) => {
  const phase = useSharedValue(0);
  const layoutWidth = useSharedValue(0);
  const layoutHeight = useSharedValue(0);
  const animatedPercentageSV = useSharedValue(percentage);

  // Spring configuration - adjusted for a slower, smoother, water-like feel
  const springConfig = {
    mass: 4, // Increased mass for a heavier, slower feel
    damping: 100, // Significantly increased damping to make it glide smoothly
    stiffness: 120, // Moderate stiffness
    overshootClamping: true, // Prevents the water level from overshooting the target
    restDisplacementThreshold: 0.01, // How close to the target to consider it settled
    restSpeedThreshold: 0.5, // How slow it needs to be moving to be considered settled
  };

  useEffect(() => {
    animatedPercentageSV.value = withSpring(percentage, springConfig);
  }, [percentage, animatedPercentageSV, springConfig]);

  useFrameCallback((frameInfo) => {
    "worklet";
    const timeDelta = frameInfo.timeSincePreviousFrame ?? 1 / 60;
    const newPhase =
      (phase.value + timeDelta * WAVE_SPEED * 0.1) % (2 * Math.PI);
    phase.value = newPhase;
  });

  // Font creation using Skia's default font manager
  const fonts = useMemo(() => {
    let mainFt: SkFont | null = null;
    let subFt: SkFont | null = null;
    try {
      // Attempt to get the system font manager instance
      const fontMgr = Skia.FontMgr.System();
      if (fontMgr) {
        const mainTypeface: SkTypeface | null = fontMgr.matchFamilyStyle(
          "sans-serif",
          {
            weight: FontWeight.Bold,
            width: FontWidth.Normal,
            slant: FontSlant.Upright,
          }
        );
        if (mainTypeface) {
          mainFt = Skia.Font(mainTypeface, mainTextSize);
        }
        const subTypeface: SkTypeface | null = fontMgr.matchFamilyStyle(
          "sans-serif",
          {
            weight: FontWeight.Normal,
            width: FontWidth.Normal,
            slant: FontSlant.Upright,
          }
        );
        if (subTypeface) {
          subFt = Skia.Font(subTypeface, subTextSize);
        }
      }
    } catch (e) {
      console.error("Failed to load system font:", e);
    }
    return { mainFont: mainFt, subFont: subFt };
  }, [mainTextSize, subTextSize]);

  const { mainFont, subFont } = fonts;

  // Derived values for main text properties
  const mainTextX = useReanimatedDerivedValue(() => {
    "worklet";
    if (layoutWidth.value > 0 && mainFont && mainText) {
      return (layoutWidth.value - mainFont.measureText(mainText).width) / 2;
    }
    return 0;
  }, [mainFont, mainText, layoutWidth]);

  const mainTextY = useReanimatedDerivedValue(() => {
    "worklet";
    return layoutHeight.value > 0 ? layoutHeight.value * 0.38 : 0;
  }, [layoutHeight]);

  const mainTextOpacity = useReanimatedDerivedValue(() => {
    "worklet";
    return layoutWidth.value > 0 &&
      layoutHeight.value > 0 &&
      mainFont &&
      mainText
      ? 1
      : 0;
  }, [layoutWidth, layoutHeight, mainFont, mainText]);

  // Derived values for sub text properties
  const subTextX = useReanimatedDerivedValue(() => {
    "worklet";
    if (layoutWidth.value > 0 && subFont && subText) {
      return (layoutWidth.value - subFont.measureText(subText).width) / 2;
    }
    return 0;
  }, [subFont, subText, layoutWidth]);

  const subTextY = useReanimatedDerivedValue(() => {
    "worklet";
    return layoutHeight.value > 0 ? layoutHeight.value * 0.48 : 0;
  }, [layoutHeight]);

  const subTextOpacity = useReanimatedDerivedValue(() => {
    "worklet";
    return layoutWidth.value > 0 && layoutHeight.value > 0 && subFont && subText
      ? 1
      : 0;
  }, [layoutWidth, layoutHeight, subFont, subText]);

  const iconSkPath = useMemo(
    () => Skia.Path.MakeFromSVGString(ICON_PATH_DATA),
    []
  );

  // Text and Icon opacity (visibility)
  const iconOpacity = useReanimatedDerivedValue(() => {
    "worklet";
    return showIcon &&
      layoutWidth.value > 0 &&
      layoutHeight.value > 0 &&
      iconSkPath
      ? 1
      : 0;
  }, [showIcon, layoutWidth, layoutHeight, iconSkPath]);

  // Text and Icon positions/transforms
  const iconTransform = useReanimatedDerivedValue(() => {
    "worklet";
    if (!iconSkPath || layoutWidth.value === 0 || layoutHeight.value === 0)
      return [];
    const originalIconWidth = 14,
      originalIconHeight = 19;
    const scale = iconSize / originalIconHeight;
    const scaledWidth = originalIconWidth * scale;
    const x = (layoutWidth.value - scaledWidth) / 2;
    const y = layoutHeight.value * iconCenterYFactor - iconSize / 2;
    return [{ translateX: x }, { translateY: y }, { scale }];
  }, [layoutWidth, layoutHeight, iconSize, iconSkPath, iconCenterYFactor]);

  const pressableIconPositionAndSize = useReanimatedDerivedValue(() => {
    "worklet";
    if (layoutWidth.value === 0 || layoutHeight.value === 0 || !iconSkPath) {
      return { left: -1000, top: -1000, width: 0, height: 0 }; // Off-screen and zero size initially
    }
    // For the pressable area, we want a square with side length equal to iconSize
    const pressableWidth = iconSize;
    const pressableHeight = iconSize;

    const pressableX = (layoutWidth.value - pressableWidth) / 2; // Center the square
    const pressableY =
      layoutHeight.value * iconCenterYFactor - pressableHeight / 2; // Center vertically based on iconCenterYFactor and square height

    return {
      left: pressableX,
      top: pressableY,
      width: pressableWidth,
      height: pressableHeight,
    };
  }, [layoutWidth, layoutHeight, iconSize, iconSkPath, iconCenterYFactor]);

  const isIconActuallyInteractive = useReanimatedDerivedValue(() => {
    "worklet";
    return (
      layoutWidth.value > 0 && layoutHeight.value > 0 && showIcon && iconSkPath
    );
  }, [layoutWidth, layoutHeight, showIcon, iconSkPath]);

  const animatedPressableStyle = useAnimatedStyle(() => {
    "worklet";
    const { left, top, width, height } = pressableIconPositionAndSize.value;
    const interactive = isIconActuallyInteractive.value;
    return {
      position: "absolute",
      left,
      top,
      width,
      height,
      backgroundColor: "transparent", // No more debug background
      zIndex: 1000,
      opacity: interactive ? 1 : 0, // Control opacity based on interactivity
      pointerEvents: interactive ? "auto" : "none", // Control touchability
    };
  }, [pressableIconPositionAndSize, isIconActuallyInteractive]); // Added isIconActuallyInteractive to dependencies

  const path = useReanimatedDerivedValue(() => {
    "worklet";
    if (layoutWidth.value === 0 || layoutHeight.value === 0) {
      return Skia.Path.Make(); // Return an empty path if layout is not determined yet
    }

    const currentWidth = layoutWidth.value;
    const currentHeight = layoutHeight.value;
    const currentWaveLength = currentWidth; // Wave length is the full width of the component

    const p = Skia.Path.Make();

    const normalizedUserPercentage =
      Math.max(0, Math.min(100, animatedPercentageSV.value)) / 100;
    const normalizedYPad = Math.max(0, yPad) / 100; // yPad is a percentage e.g. 5 for 5%

    const pixelYPad = normalizedYPad * currentHeight;

    // Top Y where wave crest should be at 100% water level
    const waveCrestAtTopLimit = pixelYPad;
    // Bottom Y where wave trough should be at 0% water level
    const waveTroughAtBottomLimit = currentHeight - pixelYPad;

    // Calculate baseline limits
    const highestPossibleWaveBaseline = waveCrestAtTopLimit + WAVE_HEIGHT / 2;
    const lowestPossibleWaveBaseline =
      waveTroughAtBottomLimit - WAVE_HEIGHT / 2;

    // Span for the baseline to move. Must be non-negative.
    const availableBaselineSpan =
      lowestPossibleWaveBaseline - highestPossibleWaveBaseline;
    const clampedBaselineSpan = Math.max(0, availableBaselineSpan);

    // Final waveBaseline calculation
    // When percentage is 100% (normalizedUserPercentage=1), baseline is highestPossibleWaveBaseline.
    // When percentage is 0% (normalizedUserPercentage=0), baseline is lowestPossibleWaveBaseline (if span > 0).
    const waveBaseline =
      highestPossibleWaveBaseline +
      (1 - normalizedUserPercentage) * clampedBaselineSpan;

    p.moveTo(0, waveBaseline);

    for (let x = 0; x <= currentWidth; x += 5) {
      const y =
        waveBaseline +
        (WAVE_HEIGHT / 2) *
          Math.sin((x / currentWaveLength) * 2 * Math.PI + phase.value);
      p.lineTo(x, y);
    }

    p.lineTo(currentWidth, currentHeight); // Bottom-right corner of the component
    p.lineTo(0, currentHeight); // Bottom-left corner of the component
    p.close(); // Close the path to fill it
    return p;
  }, [phase, animatedPercentageSV, layoutWidth, layoutHeight, yPad]); // Use animatedPercentageSV in dependencies

  return (
    <View style={{ flex: 1 }}>
      <Canvas
        style={{ flex: 1 }} // Canvas fills its parent container
        onLayout={(event) => {
          layoutWidth.value = event.nativeEvent.layout.width;
          layoutHeight.value = event.nativeEvent.layout.height;
        }}
      >
        {/* 1. Water Wave Background */}
        <Path path={path} color={WATER_COLOR} />

        {/* Main Text - Above Water */}
        {mainFont && (
          <Group opacity={mainTextOpacity}>
            <SkiaText
              x={mainTextX}
              y={mainTextY}
              text={mainText}
              font={mainFont}
              color={themedMainTextColor}
            />
          </Group>
        )}

        {/* Sub Text - Above Water */}
        {subFont && (
          <Group opacity={subTextOpacity}>
            <SkiaText
              x={subTextX}
              y={subTextY}
              text={subText}
              font={subFont}
              color={themedSubTextColor}
            />
          </Group>
        )}

        {/* Icon - Above Water */}
        {iconSkPath && (
          <Group transform={iconTransform} opacity={iconOpacity}>
            <Path path={iconSkPath} color={iconColorAboveWater} />
          </Group>
        )}

        {/* Clipped Group for Under Water Text */}
        <Group clip={path}>
          {mainFont && (
            <Group opacity={mainTextOpacity}>
              <SkiaText
                x={mainTextX}
                y={mainTextY}
                text={mainText}
                font={mainFont}
                color={mainTextColorUnderWater}
              />
            </Group>
          )}
          {subFont && (
            <Group opacity={subTextOpacity}>
              <SkiaText
                x={subTextX}
                y={subTextY}
                text={subText}
                font={subFont}
                color={subTextColorUnderWater}
              />
            </Group>
          )}
          {/* Icon - Under Water (Clipped) */}
          {iconSkPath && (
            <Group transform={iconTransform} opacity={iconOpacity}>
              <Path path={iconSkPath} color={iconColorUnderWater} />
            </Group>
          )}
        </Group>
      </Canvas>

      {/* Clickable overlay for the icon */}
      {onIconPress && (
        <AnimatedPressable
          style={animatedPressableStyle}
          onPress={() => {
            // No need to log here anymore, the actual onIconPress will be called
            if (isIconActuallyInteractive.value && onIconPress) {
              onIconPress();
            }
          }}
        />
      )}
    </View>
  );
};

export default function TabFourScreen() {
  const theme = useTheme();

  const mainTextColorFromTheme = theme.color10.get();
  const subTextColorFromTheme = theme.color8.get();
  const iconColorFromTheme = theme.blue10.get();

  const handleIconPress = () => {
    console.log("Droplet icon pressed from TabFourScreen!");
    // Add your logic here, e.g., open a modal, increment water, etc.
  };

  return (
    <AppAnimated.YStack flex={1} bg="$background">
      <TestAnimated
        yPad={1}
        percentage={20}
        mainText="1.800ml"
        mainTextSize={56}
        themedMainTextColor={mainTextColorFromTheme}
        subText="Remaining 600ml"
        subTextSize={16}
        themedSubTextColor={subTextColorFromTheme}
        showIcon={true}
        iconSize={75}
        iconColorAboveWater={iconColorFromTheme}
        iconCenterYFactor={0.78}
        onIconPress={handleIconPress}
      />
    </AppAnimated.YStack>
  );
}
