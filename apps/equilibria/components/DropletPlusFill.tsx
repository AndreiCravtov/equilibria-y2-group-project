import React, { memo, NamedExoticComponent } from "react";
import { Svg, Path } from "react-native-svg";
import { type IconProps, themed } from "@tamagui/helpers-icon";

const Icon = (props: IconProps) => {
  const { color, size, ...otherProps } = {
    color: props.color ?? "currentColor",
    size: props.size ?? 24,
    ...props,
  };
  return (
    <Svg
      viewBox="0 0 14 19"
      // @ts-ignore
      width={size}
      // @ts-ignore
      height={size}
      // @ts-ignore
      fill={color}
      {...otherProps}
    >
      <Path d="M 7,0 C 6.5,2.5 5,4.9 3,6.5 1,8.1 0,10 0,12 a 7,7 0 0 0 7,7 7,7 0 0 0 7,-7 C 14,10 13,8.1 11,6.5 9,4.9 7.5,2.5 7,0 Z m 0,8.320312 a 0.83990323,0.83990323 0 0 1 0.839844,0.839844 v 2.03711 h 2.037109 a 0.83990323,0.83990323 0 0 1 0.837891,0.83789 0.83990323,0.83990323 0 0 1 -0.837891,0.84375 H 7.839844 v 2.033203 A 0.83990323,0.83990323 0 0 1 7,15.755859 0.83990323,0.83990323 0 0 1 6.160156,14.912109 V 12.878906 H 4.1230469 a 0.83990323,0.83990323 0 0 1 -0.8398438,-0.84375 0.83990323,0.83990323 0 0 1 0.8398438,-0.83789 H 6.160156 V 9.160156 A 0.83990323,0.83990323 0 0 1 7,8.320312 Z" />
    </Svg>
  );
};

Icon.displayName = "DropletPlusFill";

export const DropletPlusFill: NamedExoticComponent<IconProps> = memo<IconProps>(
  themed(Icon)
);
