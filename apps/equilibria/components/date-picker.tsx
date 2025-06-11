import { ArrowLeft, ArrowRight } from "@tamagui/lucide-icons";
import { LinearGradientPoint } from "expo-linear-gradient";
import { Button, SizableText, XStack, YStack, ZStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { match, P } from "ts-pattern";

interface ArrowButtonProps {
  direction: "left" | "right";
}

const ArrowButton = Button.styleable<ArrowButtonProps>(
  // SEE: the `_ref` is a hack to suppress backwards compatibility issue https://github.com/tamagui/tamagui/issues/3132
  (props, _ref?: never) => {
    const { direction, ...otherProps } = props;
    const Icon = match(direction)
      .with("left", () => ArrowLeft)
      .with("right", () => ArrowRight)
      .exhaustive();

    return (
      <Button size="$5" icon={<Icon size="$1.5" />} {...otherProps} circular />
    );
  }
);

interface DateItemProps {
  selected?: boolean;
}

function DateItem(props: DateItemProps) {
  const { selected = false, ...otherProps } = props;

  return (
    <YStack
      width="$5"
      height="100%"
      justify="center"
      items="center"
      rounded="$radius.12"
      bg={selected ? "$indigo12" : undefined}
    >
      <SizableText
        lineHeight={22}
        fontSize="$5"
        fontWeight="bold"
        themeInverse={selected}
      >
        MON
      </SizableText>
      <SizableText lineHeight={16} fontSize="$7" themeInverse={selected}>
        3
      </SizableText>
    </YStack>
  );
}

interface GradientFadeProps {
  direction: "left" | "right";
}

const GradientFade = LinearGradient.styleable<GradientFadeProps>(
  // SEE: the `_ref` is a hack to suppress backwards compatibility issue https://github.com/tamagui/tamagui/issues/3132
  (props, _ref?: never) => {
    const { direction, ...otherProps } = props;
    const { start, end } = match(direction)
      .with("left", () => ({
        start: [0, 0.5] satisfies LinearGradientPoint,
        end: [1, 0.5] satisfies LinearGradientPoint,
      }))
      .with("right", () => ({
        start: [1, 0.5] satisfies LinearGradientPoint,
        end: [0, 0.5] satisfies LinearGradientPoint,
      }))
      .exhaustive();

    return (
      <LinearGradient
        width="$10"
        height="100%"
        colors={["$gray5", "$colorTransparent"]}
        locations={[0.1, 1]}
        start={start}
        end={end}
        {...otherProps}
      />
    );
  }
);

export default function DatePicker() {
  return (
    <XStack height="$7" width="100%" items="center" px="$2" gap="$2" bg="pink">
      <ArrowButton direction="left" />

      <ZStack
        flex={1}
        height="100%"
        bg="$gray5"
        rounded="$radius.12"
        overflow="hidden"
      >
        <XStack
          width="100%"
          height="100%"
          gap="$1.5"
          justify="center"
          py="$1.5"
          px="$2"
        >
          <DateItem />
          <DateItem />
          <DateItem selected />
          <DateItem />
          <DateItem />
        </XStack>

        {/* Fade styling */}
        <GradientFade self="flex-start" direction="left" />
        <GradientFade self="flex-end" direction="right" />
      </ZStack>

      <ArrowButton direction="right" />
    </XStack>
  );
}
