import {
  memo,
  NamedExoticComponent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Svg, { Path as SvgPath, Text as SvgText } from "react-native-svg";
import { type IconProps, themed } from "@tamagui/helpers-icon";
import {
  GetThemeValueForKey,
  SizableText,
  TamaguiComponent,
  TamaguiElement,
  useTheme,
  View,
  YStack,
  ZStack,
} from "tamagui";
import { View as RNView } from "react-native";
import { A } from "@mobily/ts-belt";

interface RulerLinesSvgProps extends IconProps {
  /**
   * Percentage of parent height for top/bottom padding
   */
  yPad?: number;
}

const RulerLinesSvgBare = (props: RulerLinesSvgProps) => {
  const {
    yPad = 1,
    color = "currentColor",
    width = "100%",
    height = "100%",
    ...otherProps
  } = props;

  // measure SVG size
  const [dim, setDim] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });
  const svgRef = useRef<Svg | null>(null);
  useLayoutEffect(() => {
    svgRef.current?.measure((x, y, width, height, _pageX, _pageY) => {
      const yPadCal = yPad * 0.01 * height;
      const newY = y + yPadCal;
      const newHeight = height - yPadCal;

      setDim({
        x,
        y: newY,
        w: width,
        h: newHeight,
      });
    });
  }, [yPad]);

  // generate SVG path by iterating from 0% to 100% by step 5%
  const d = [];
  for (let pc = 0; pc <= 100; pc += 5) {
    // compute the scaling factor on the width
    const scaleW = (() => {
      if (pc % 100 === 0) return 1;
      if (pc % 50 === 0) return 0.75;
      if (pc % 25 === 0) return 0.5;
      return null;
    })();
    if (scaleW === null) continue;

    // Compute the y position and ending x position
    const posY = (1 - 0.01 * pc) * (dim.h - dim.y) + dim.y;
    const posX = scaleW * (dim.w - dim.x) + dim.x;

    d.push(`M ${dim.x} ${posY}`);
    d.push(`L ${posX} ${posY}`);
  }

  return (
    <Svg
      // @ts-ignore
      width={width}
      // @ts-ignore
      height={height}
      // @ts-ignore
      stroke={color}
      ref={svgRef}
      {...otherProps}
    >
      <SvgPath d={d.join(" ")} strokeWidth={3} />
    </Svg>
  );
};
RulerLinesSvgBare.displayName = "RulerLines";

const RulerLinesSvg: NamedExoticComponent<RulerLinesSvgProps> =
  memo<RulerLinesSvgProps>(themed(RulerLinesSvgBare));

interface RulerLinesProps {
  /**
   * Percentage of parent height for top/bottom padding
   */
  yPad?: number;
  rulerStroke?: GetThemeValueForKey<"color">;
}

export function RulerLines(props: RulerLinesProps) {
  const { yPad = 1, rulerStroke, ...otherProps } = props;
  const theme = useTheme();

  // measure ZStack size
  const [dim, setDim] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });
  const rnViewRef = useRef<RNView | null>(null);
  useLayoutEffect(() => {
    rnViewRef.current?.measure((x, y, width, height, _pageX, _pageY) => {
      const yPadCal = yPad * 0.01 * height;
      const newY = y + yPadCal;
      const newHeight = height - yPadCal;

      setDim({
        x,
        y: newY,
        w: width,
        h: newHeight,
      });
    });
  }, [yPad]);

  const notches: { posX: number; posY: number; pc: number }[] = [];
  for (let pc = 0; pc <= 100; pc += 5) {
    // compute the scaling factor on the width
    const scaleW = (() => {
      if (pc % 100 === 0) return 1;
      if (pc % 50 === 0) return 0.75;
      if (pc % 25 === 0) return 0.5;
      return null;
    })();
    if (scaleW === null) continue;

    // Compute the y position and ending x position
    const posY = (1 - 0.01 * pc) * (dim.h - dim.y) + dim.y;
    const posX = scaleW * (dim.w - dim.x) + dim.x;

    notches.push({ posX, posY, pc });
  }

  // Label configuration
  const LABEL_LINE_HEIGHT = 24;
  const LABEL_GAP = 4;
  const LABEL_FONT_SIZE = 16;

  return (
    <ZStack height="100%" width="$1" overflow="visible">
      {/* Lines */}
      <RulerLinesSvg yPad={yPad} color={rulerStroke} {...otherProps} />

      {/* Text */}
      <RNView
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
        ref={rnViewRef}
      >
        {notches.map(({ posX, posY, pc }) => (
          <SizableText
            key={pc}
            lineHeight={LABEL_LINE_HEIGHT}
            fontSize={LABEL_FONT_SIZE}
            width="$4"
            position="absolute"
            t={posY - LABEL_LINE_HEIGHT / 2}
            l={posX + LABEL_GAP}
            // color={rulerStroke ? theme.color.get(rulerStroke) : undefined}
          >
            {pc}%
          </SizableText>
        ))}
      </RNView>
    </ZStack>
  );
}
