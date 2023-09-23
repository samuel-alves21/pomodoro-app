import { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { TimerContext, TimerContextType } from '../../../../../../contexts/TimerContext'
import { standardValues } from '../../../../../../utilities/standardValues'
import { ButtonContextType, ButtonsContext } from '../../../../../../contexts/ButtonsContext'
import { getUserConfig } from '../../../../../../firebase/getUserConfig'
import { UserContext, UserContextType } from '../../../../../../contexts/UserContext'

interface CircleProps {
  shouldAnimate: boolean
  isDefault: boolean
}

interface WrapperProps {
  isDefault: boolean
}

interface DefaultToggleButtonProps {
  setIsChanged: (value: boolean) => void
}

export const DefaultToggleButton = ({ setIsChanged }: DefaultToggleButtonProps) => {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const {
    timeState: { isDefault },
    timeDispatch,
  } = useContext(TimerContext) as TimerContextType

  const { buttonDispatch } = useContext(ButtonsContext) as ButtonContextType

  const { userState } = useContext(UserContext) as UserContextType

  useEffect(() => {
    if (isDefault) {
      timeDispatch({ type: 'CONFIG_POMODORO_TIME', payload: standardValues.pomodoro })
      timeDispatch({ type: 'CONFIG_SHORT_TIME', payload: standardValues.short })
      timeDispatch({ type: 'CONFIG_LONG_TIME', payload: standardValues.long })
      timeDispatch({ type: 'CONFIG_CYCLES', payload: standardValues.cycles })
      timeDispatch({ type: 'RESET_ALL' })
      buttonDispatch({ type: 'CLICKED', payload: false })
      buttonDispatch({ type: 'POMODORO' })
    } else {
      if (!userState.pendentUser) getUserConfig(userState.id, timeDispatch)
    }
  }, [isDefault, timeDispatch, buttonDispatch, userState.id, userState.pendentUser])

  const handleClick = () => {
    setIsChanged(false)
    setShouldAnimate(true)
    timeDispatch({ type: 'SET_DEFAULT', payload: !isDefault })
  }

  return (
    <>
      <span onClick={handleClick}>pomodoro default:</span>
      <Wrapper onClick={handleClick} isDefault={isDefault}>
        <Circle shouldAnimate={shouldAnimate} isDefault={isDefault}></Circle>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div<WrapperProps>`
  width: 65px;
  height: 25px;
  border-radius: 20px;
  border: 1px solid #fff;
  cursor: pointer;
  padding: 0 2px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease-in-out;

  background-color: ${({ isDefault }) => (isDefault ? 'var(--color-primary)' : 'transparent')};
`

const Circle = styled.div<CircleProps>`
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background-color: #fff;

  ${({ shouldAnimate, isDefault }) => {
    if (shouldAnimate) {
      if (isDefault) {
        return `
        animation: circle-slide-in 0.3s ease-in-out forwards;
      `
      } else {
        return `
        animation: circle-slide-out 0.3s ease-in-out forwards;
      `
      }
    }
  }}

  @keyframes circle-slide-in {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(183%);
    }
  }

  @keyframes circle-slide-out {
    0% {
      transform: translateX(183%);
    }

    100% {
      transform: translateX(0);
    }
  }
`
