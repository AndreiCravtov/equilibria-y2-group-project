import { H2, Button } from 'tamagui'
import { ReactNode } from 'react'

type EquilibriaH2Props = {
  children: ReactNode
}

type EquilibriaButtonProps = {
  children: ReactNode,
  pressFunc: () => any,
}

export function EquilibriaH2({ children }: EquilibriaH2Props) {
  return (
    <H2 fontWeight="bold" color="$indigo12" bg="#FFFFFF" fontSize={32} textAlign={"center"}>
      {children}
    </H2>
  )
}

export function EquilibriaButton({ children, pressFunc }: EquilibriaButtonProps) {
  return (
    <Button
      onPress={pressFunc}
      color="$indigo4"
      bg="$blue8Dark"
      fontWeight={"bold"}
      fontSize="$6"
      pressStyle={{
        bg: '$blue10',
        scale: 0.96,
      }}
    >
      {children}
    </Button>
  )
}