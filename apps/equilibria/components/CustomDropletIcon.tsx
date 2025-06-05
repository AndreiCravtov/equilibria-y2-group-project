import React from "react";
import { Svg, Path } from "react-native-svg";
import { ColorTokens, ThemeTokens } from "tamagui"; // For color prop type compatibility

// Define a more generic IconProps interface, similar to what lucide-react-native might use
interface CustomIconProps {
  size?: number;
  color?: ColorTokens | ThemeTokens | string; // Allow Tamagui color tokens or any CSS color string
  style?: any; // Allow passing style for positioning, etc.
  // You can add other SVG props here if needed, like strokeWidth, etc.
}

const CustomDropletIcon: React.FC<CustomIconProps> = ({
  size = 24, // Default icon size
  color = "currentColor", // Default to currentColor, common for icons to inherit color
  ...rest // Spread other props (like style) onto the Svg element
}) => {
  // Extracted path data from your SVG
  const pathData =
    "M 7,0 C 6.5,2.5 5,4.9 3,6.5 1,8.1 0,10 0,12 a 7,7 0 0 0 7,7 7,7 0 0 0 7,-7 C 14,10 13,8.1 11,6.5 9,4.9 7.5,2.5 7,0 Z m 0,8.320312 a 0.83990323,0.83990323 0 0 1 0.839844,0.839844 v 2.03711 h 2.037109 a 0.83990323,0.83990323 0 0 1 0.837891,0.83789 0.83990323,0.83990323 0 0 1 -0.837891,0.84375 H 7.839844 v 2.033203 A 0.83990323,0.83990323 0 0 1 7,15.755859 0.83990323,0.83990323 0 0 1 6.160156,14.912109 V 12.878906 H 4.1230469 a 0.83990323,0.83990323 0 0 1 -0.8398438,-0.84375 0.83990323,0.83990323 0 0 1 0.8398438,-0.83789 H 6.160156 V 9.160156 A 0.83990323,0.83990323 0 0 1 7,8.320312 Z";

  return (
    <Svg
      width={size}
      height={size} // Set width and height to the same size prop
      viewBox="0 0 14 19" // Use viewBox to maintain aspect ratio
      // The original SVG root had fill="none" and stroke attributes.
      // However, the path itself is styled with fill and stroke-width:0.
      // We will control the path's fill with the 'color' prop.
      {...rest} // Spread allows passing style from Tamagui or other props
    >
      <Path
        d={pathData}
        fill={color} // The icon shape is defined by fill
        // The original path had stroke-width:0, so no stroke is applied here.
      />
    </Svg>
  );
};

export default CustomDropletIcon;
