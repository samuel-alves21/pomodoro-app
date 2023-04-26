import { createContext, useReducer } from 'react'
import { ButtonAction, initialState, reducer } from './reducer'

export interface MyContext {
  buttonState: typeof initialState
  buttonDispatch: React.Dispatch<ButtonAction>
}

interface Props {
  children: React.ReactNode
}

export const ButtonsContext = createContext<MyContext | null>(null)

export const ButtonsProvider = (props: Props) => {
  const [buttonState, buttonDispatch] = useReducer(reducer, initialState)
  return (
    <ButtonsContext.Provider value={{ buttonState, buttonDispatch }}>
      {props.children}
    </ButtonsContext.Provider>
  )
}
