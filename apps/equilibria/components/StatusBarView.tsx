import { StatusBar } from "react-native";
import { View } from "tamagui";

/**
 * View which is the height of the status bar.
 */
const StatusBarView = View.styleable((props, _ref?: never) => {
  const { ...otherProps } = props;
  return <View height={StatusBar.currentHeight} width="100%" {...otherProps} />;
});

StatusBarView.displayName = "StatusBarView";
export default StatusBarView;
