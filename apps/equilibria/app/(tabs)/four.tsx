import { ExternalLink } from "@tamagui/lucide-icons";
import { Anchor, H2, Paragraph, XStack, YStack } from "tamagui";
import { ToastControl } from "@/app/CurrentToast";
import { SignIn } from "../SignIn";
import { Authenticated, Unauthenticated } from "convex/react";
import Animated, {
  useSharedValue,
  useFrameCallback,
  Easing as ReanimatedEasing,
  useDerivedValue as useReanimatedDerivedValue,
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

const WAVE_HEIGHT = 30; // Amplitude of the wave - Made shallower
const WAVE_SPEED = 0.01; // Speed of the wave animation - Made slower
const WATER_COLOR = "#0077FF"; // Blue color for the water

interface TestAnimatedProps {
  percentage: number; // 0 to 100, represents how full the water level is
  yPad: number; // Percentage of parent height for top/bottom padding
  mainText?: string;
  mainTextSize?: number;
  mainTextColorAboveWater?: string;
  mainTextColorUnderWater?: string;
  subText?: string;
  subTextSize?: number;
  subTextColorAboveWater?: string;
  subTextColorUnderWater?: string;
}

const TestAnimated = ({
  percentage,
  yPad,
  mainText = "1.800ml",
  mainTextSize = 60,
  mainTextColorAboveWater = "#1E3A8A", // Dark Blue
  mainTextColorUnderWater = "#FFFFFF",
  subText = "Remaining 600ml",
  subTextSize = 18,
  subTextColorAboveWater = "#60A5FA", // Lighter Blue/Grey
  subTextColorUnderWater = "#FFFFFF",
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

  // Derived values for text positioning (centered horizontally)
  const mainTextPosition = useReanimatedDerivedValue(() => {
    "worklet";
    if (
      !mainFont ||
      !mainText ||
      layoutWidth.value === 0 ||
      layoutHeight.value === 0
    )
      return { x: 0, y: 0, visible: false };
    const textWidth = mainFont.measureText(mainText).width;
    return {
      x: (layoutWidth.value - textWidth) / 2,
      y: layoutHeight.value * 0.38, // Adjusted based on reference (approximate)
      visible: true,
    };
  }, [mainFont, mainText, layoutWidth, layoutHeight]);

  const subTextPosition = useReanimatedDerivedValue(() => {
    "worklet";
    if (
      !subFont ||
      !subText ||
      layoutWidth.value === 0 ||
      layoutHeight.value === 0
    )
      return { x: 0, y: 0, visible: false };
    const textWidth = subFont.measureText(subText).width;
    return {
      x: (layoutWidth.value - textWidth) / 2,
      y: layoutHeight.value * 0.48, // Adjusted based on reference (approximate)
      visible: true,
    };
  }, [subFont, subText, layoutWidth, layoutHeight]);

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
    <Canvas
      style={{ flex: 1 }} // Canvas fills its parent container
      onLayout={(event) => {
        layoutWidth.value = event.nativeEvent.layout.width;
        layoutHeight.value = event.nativeEvent.layout.height;
      }}
    >
      {/* 1. Water Wave Background */}
      <Path path={path} color={WATER_COLOR} />

      {/* 2. "Above water" text rendering */}
      {mainFont && mainTextPosition.value.visible && (
        <SkiaText
          x={mainTextPosition.value.x}
          y={mainTextPosition.value.y}
          text={mainText}
          font={mainFont}
          color={mainTextColorAboveWater}
        />
      )}
      {subFont && subTextPosition.value.visible && (
        <SkiaText
          x={subTextPosition.value.x}
          y={subTextPosition.value.y}
          text={subText}
          font={subFont}
          color={subTextColorAboveWater}
        />
      )}

      {/* 3. "Under water" text rendering (clipped) */}
      <Group clip={path}>
        {mainFont && mainTextPosition.value.visible && (
          <SkiaText
            x={mainTextPosition.value.x}
            y={mainTextPosition.value.y}
            text={mainText}
            font={mainFont}
            color={mainTextColorUnderWater}
          />
        )}
        {subFont && subTextPosition.value.visible && (
          <SkiaText
            x={subTextPosition.value.x}
            y={subTextPosition.value.y}
            text={subText}
            font={subFont}
            color={subTextColorUnderWater}
          />
        )}
      </Group>
    </Canvas>
  );
};

export default function TabFourScreen() {
  return (
    <AppAnimated.YStack flex={1} bg="$background">
      <TestAnimated
        yPad={1}
        percentage={53} // Example: 80% full
        mainText="1.800ml"
        mainTextSize={56} // Slightly adjusted
        mainTextColorAboveWater="#1E40AF" // Tailwind blue-800
        subText="Remaining 600ml"
        subTextSize={16} // Slightly adjusted
        subTextColorAboveWater="#60A5FA" // Tailwind blue-400
        // mainTextColorUnderWater and subTextColorUnderWater default to white
      />
    </AppAnimated.YStack>
  );
}
