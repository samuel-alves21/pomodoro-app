import styled from 'styled-components'
import { Arrows } from './Arrows'
import { formatConfigInput } from '../../../../../../functions/formatConfigInput'
import { useContext, useEffect } from 'react'
import { TimerContext } from '../../../../../../contexts/TimerContext'
import { minutesToSeconds } from '../../../../../../functions/minutesToSeconds'
import { limitValues } from '../../../../../../utilities/limitValues'
import { verifyLimit } from '../../../../../../functions/verifyLimit'
import { acrementTime } from '../../../../../../functions/acrementTime'
import { decrementTime } from '../../../../../../functions/decrementTime'
import { ButtonsContext, ButtonContext } from '../../../../../../contexts/ButtonsContext'
import { Id } from '../../../../../../types/types'
import { TimerActionType } from '../../../../../../contexts/TimerContext/types'

interface Props {
  id: Id
  state: string
  setState: (value: string) => void
}

export const Input = ({ state, setState, id }: Props) => {
  const { timeDispatch } = useContext(TimerContext) as TimerContext
  const { buttonDispatch } = useContext(ButtonsContext) as ButtonContext

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const thisElement = e.target as HTMLElement

    if (Number(state) < limitValues.min[id]) {
      setState(limitValues.min[id].toString())
      thisElement.blur()
      return
    }
    if (Number(state) > limitValues.max[id]) {
      setState(limitValues.max[id].toString())
      thisElement.blur()
      return
    }
    setState(Number(state).toString())
    thisElement.blur()
  }

  const handleWhell = (e: React.WheelEvent<HTMLInputElement>) => {
    if (e.deltaY < 0) {
      setState(acrementTime(Number(state), id).toString())
    } else {
      setState(decrementTime(Number(state), id).toString())
    }
  }

  useEffect(() => {
    if (id !== 'cycles') {
      timeDispatch({
        type: `CONFIG_${id.toUpperCase()}_TIME` as TimerActionType,
        payload: verifyLimit(Number(state), id),
      })
    } else {
      timeDispatch({
        type: 'CONFIG_CYCLES',
        payload: verifyLimit(Number(state), id),
      })
    }
    timeDispatch({ type: 'RESET_ALL' })
    buttonDispatch({ type: 'CLICKED', payload: false })
    buttonDispatch({ type: 'POMODORO' })
  }, [state, id, timeDispatch, buttonDispatch ])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const thisElement = e.target as HTMLElement
    if (e.key === 'Backspace') setState('')
    if (e.key === 'Enter') {
      thisElement.blur()
    }
    if (e.key === 'ArrowUp') {
      setState(acrementTime(Number(state), id).toString())
    }
    if (e.key === 'ArrowDown') {
      setState(decrementTime(Number(state), id).toString())
    }
    if (state.length === 2) return
    if (state.length === 1 && id === 'cycles') return
    if (!/^[0-9]+$/.test(e.key)) return
    setState(Number(state + e.key).toString())
  }

  return (
    <InputAndArrows>
      <InputField
        onKeyDown={(e) => handleKeyDown(e)}
        onFocus={() => setState('')}
        onBlur={(e) => handleBlur(e)}
        type='text'
        value={formatConfigInput(Number(state), id)}
        id={id}
        readOnly={false}
        onWheel={(e) => handleWhell(e)}
      />
      <Arrows state={state} setState={setState} id={id} />
    </InputAndArrows>
  )
}

const InputAndArrows = styled.div`
  display: flex;

  & > div {
    border-radius: 0 5px 5px 0;
  }
`

const InputField = styled.input`
  width: 70px;
  border-radius: 5px 0 0 5px;
  height: 35px;
`
