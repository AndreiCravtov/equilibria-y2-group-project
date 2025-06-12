import React, { ReactNode } from "react";
import { H3, H4, H6, Spinner, YStack } from "tamagui";

export interface LoadingViewProps {
  spinner?: ReactNode;
  loadingMessage?: ReactNode;
}

export const LoadingView = YStack.styleable<LoadingViewProps>(
  (props, _ref?: never) => {
    const {
      spinner = <Spinner size="large" color="$indigo10" />,

      loadingMessage = <H6>Loading...</H6>,
      ...otherProps
    } = props;
    return (
      <YStack
        width="100%"
        height="100%"
        flex={1}
        gap="$2"
        justify="center"
        items="center"
        bg="$background"
        {...otherProps}
      >
        {spinner}
        {loadingMessage}
      </YStack>
    );
  }
);

LoadingView.displayName = "LoadingView";
