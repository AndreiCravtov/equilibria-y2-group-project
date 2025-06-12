import {
  getCurrentDayTimestamp,
  MS_IN_SEC,
  nextDayTimestamp,
  previousDayTimestamp,
  SECS_IN_DAY,
  timestampToDate,
} from "@/util/date";
import { ArrowLeft, ArrowRight } from "@tamagui/lucide-icons";
import { LinearGradientPoint } from "expo-linear-gradient";
import { Dispatch, RefObject, SetStateAction, useContext } from "react";
import { createContext, useState } from "react";
import { Button, SizableText, XStack, YStack, ZStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { match, P } from "ts-pattern";
import { create, createStore } from "zustand";
import AppAnimated from "@/components/app-animated";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const NUM_EXTRA_DATES = 4;
const BG_COLOR = "$gray3";

export interface DatePickerStore {
  selectedDayTimestamp: number;
  selectCurrentDay: () => void;
  selectPreviousDay: () => void;
  selectNextDay: () => void;
}

export const useDatePicker = create<DatePickerStore>((set) => ({
  selectedDayTimestamp: getCurrentDayTimestamp(),
  selectCurrentDay: () =>
    set(() => ({ selectedDayTimestamp: getCurrentDayTimestamp() })),
  selectPreviousDay: () =>
    set((state) => ({
      selectedDayTimestamp: previousDayTimestamp(state.selectedDayTimestamp),
    })),
  selectNextDay: () =>
    set((state) => ({
      selectedDayTimestamp: nextDayTimestamp(state.selectedDayTimestamp),
    })),
}));

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
      <Button
        bg={BG_COLOR}
        size="$5"
        icon={<Icon size="$1.5" />}
        {...otherProps}
        circular
      />
    );
  }
);

interface DateItemProps {
  unixTimestampSecs: number;
  selected?: boolean;
}

const DateItem = YStack.styleable<DateItemProps>((props, _ref?: never) => {
  const { selected = false, unixTimestampSecs, ...otherProps } = props;

  // Compute day from timestamp: multiply by 1,000 to get in milliseconds
  const date = timestampToDate(unixTimestampSecs);
  const dayText = DAYS[date.getUTCDay()];
  const monthDate = date.getUTCDate();
  const textColor = selected ? "$color12" : "$color11";

  return (
    <YStack
      width={44}
      height="100%"
      justify="center"
      items="center"
      rounded="$radius.12"
      bg={selected ? "$background" : undefined}
      elevation={selected ? "$0.5" : undefined}
      borderColor={selected ? "$borderColorFocus" : undefined}
      {...otherProps}
    >
      <SizableText
        lineHeight={20}
        fontSize="$4"
        fontWeight="bold"
        color={textColor}
      >
        {dayText}
      </SizableText>
      <SizableText lineHeight={14} fontSize="$6" color={textColor}>
        {monthDate}
      </SizableText>
    </YStack>
  );
});

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
        width="$6"
        height="100%"
        colors={[BG_COLOR, "$colorTransparent"]}
        locations={[0.1, 1]}
        start={start}
        end={end}
        {...otherProps}
      />
    );
  }
);

export function DatePicker() {
  // Compute current day and register for resetting on blur
  const { selectedDayTimestamp, selectPreviousDay, selectNextDay } =
    useDatePicker();

  // compute the timestamps of previous days and days after
  const dayTimestamps = [];
  for (let i = -NUM_EXTRA_DATES; i <= NUM_EXTRA_DATES; i++) {
    dayTimestamps.push(selectedDayTimestamp + i * SECS_IN_DAY);
  }

  return (
    <XStack height="$6" width="100%" items="center" px="$2" gap="$2">
      <ArrowButton direction="left" onPress={selectPreviousDay} />

      <ZStack
        animation="medium"
        flex={1}
        height="100%"
        bg={BG_COLOR}
        rounded="$radius.12"
        overflow="hidden"
      >
        <XStack
          width="100%"
          height="100%"
          gap="$2"
          justify="center"
          py="$1.5"
          px="$2"
        >
          {dayTimestamps.map((dayTimestamp) => (
            <DateItem
              unixTimestampSecs={dayTimestamp}
              key={Math.random()}
              selected={dayTimestamp === selectedDayTimestamp}
            />
          ))}
        </XStack>

        {/* Fade styling */}
        <GradientFade self="flex-start" direction="left" />
        <GradientFade self="flex-end" direction="right" />
      </ZStack>

      <ArrowButton direction="right" onPress={selectNextDay} />
    </XStack>
  );
}
