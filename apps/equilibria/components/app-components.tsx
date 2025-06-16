import { Button, H2, H4, Input } from "tamagui";

export const AppH2 = H2.styleable((props, _ref?: never) => {
  const { ...otherProps } = props;

  return (
    <H2 fontWeight="bold" color="$indigo12" fontSize="$8" {...otherProps} />
  );
});

export const AppH4 = H4.styleable((props, _ref?: never) => {
  const { ...otherProps } = props;

  return <H4 fontWeight="bold" color="$indigo12" {...otherProps} />;
});

export const AppButton = Button.styleable((props, _ref?: never) => {
  const { ...otherProps } = props;

  return (
    <Button
      color="$indigo4"
      bg="$blue8Dark"
      fontWeight="bold"
      fontSize="$6"
      pressStyle={{
        bg: "$blue10",
        scale: 0.96,
      }}
      {...otherProps}
    />
  );
});

export const AppInput = Input.styleable((props, _ref?: never) => {
  const { ...otherProps } = props;

  return (
    <Input
      placeholderTextColor="$indigo8Dark"
      color="$indigo8Dark"
      bg="$indigo2"
      borderColor="$indigo4"
      keyboardType="default"
      secureTextEntry={false}
      {...otherProps}
    />
  );
});
