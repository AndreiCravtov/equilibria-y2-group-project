import { Button, H2, Input } from "tamagui";
import { ReactNode } from "react";

type EquilibriaH2Props = {
  children: ReactNode;
};

export function EquilibriaH2({ children }: EquilibriaH2Props) {
  return (
    <H2
      fontWeight="bold"
      color="$indigo12"
      bg="#FFFFFF"
      fontSize={32}
      textAlign={"center"}
    >
      {children}
    </H2>
  );
}

type EquilibriaButtonProps = {
  children: ReactNode;
  bg?: string;
  pressFunc: () => any;
};

export function EquilibriaButton({
  children,
  bg = "$blue8Dark",
  pressFunc,
}: EquilibriaButtonProps) {
  return (
    <Button
      onPress={pressFunc}
      color="$indigo4"
      bg={bg}
      fontWeight={"bold"}
      fontSize="$6"
      pressStyle={{
        bg: "$blue10",
        scale: 0.96,
      }}
    >
      {children}
    </Button>
  );
}

type EquilibriaInputProps = {
  id?: string;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
};

export function EquilibriaInput({
  id,
  placeholder,
  keyboardType = "default",
  value,
  onChangeText,
  secureTextEntry = false,
}: EquilibriaInputProps) {
  return (
    <Input
      id={id}
      placeholder={placeholder}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="$indigo8Dark"
      color="$indigo8Dark"
      bg="$indigo2"
      borderColor="$indigo4"
      secureTextEntry={secureTextEntry}
    />
  );
}
