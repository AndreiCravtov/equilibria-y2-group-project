import { StatusBar } from "react-native";
import { View } from "tamagui";

/**
 * View which is offset from the top, the height of the status bar.
 */
const StatusBarView = View.styleable((props, _ref?: never) => {
  const { ...otherProps } = props;
  return <View pt={StatusBar.currentHeight} {...otherProps} />;
});

StatusBarView.displayName = "StatusBarView";
export default StatusBarView;
