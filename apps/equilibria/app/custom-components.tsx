import { H2 } from 'tamagui'
import { ReactNode } from 'react'

type EquilibriaH2Props = {
  children: ReactNode
}

export function EquilibriaH2({ children }: EquilibriaH2Props) {
  return (
    <H2 fontWeight="bold" color="$indigo12" bg="#FFFFFF" fontSize={32} textAlign={"center"}>
      {children}
    </H2>
  )
}