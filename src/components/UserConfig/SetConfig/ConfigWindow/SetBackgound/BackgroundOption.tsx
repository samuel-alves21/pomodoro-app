import { useContext } from 'react'
import { CustomizationContext, CustomizationContextType } from '../../../../../contexts/CustomizationContext'
import { breakpoints } from '../../../../../utilities/breakpoints'
import styled from 'styled-components'
import { SaveConfigContext, SaveConfigContextType } from '../../../../../contexts/SaveConfigContext'

interface BackgroundOptionProps {
  background: {
    path: string
    name: string
  }
}

export const BackgroundOption = ({ background }: BackgroundOptionProps) => {
  const { customizationDispatch } = useContext(CustomizationContext) as CustomizationContextType
  const { SaveConfigDispatch } = useContext(SaveConfigContext) as SaveConfigContextType

  const handleClick = () => {
    customizationDispatch({ type: 'CHANGE_BACKGROUND', payload: background.path })
    SaveConfigDispatch({ type: 'SET_IS_SAVED', payload: false })
  }

  return (
    <Wrapper onClick={handleClick}>
      <BackgroundTitle>{background.name}</BackgroundTitle>
      <img className='img-full-cover' src={background.path} alt='background-option' />
    </Wrapper>
  )
}

const BackgroundTitle = styled.p`
  width: 100%;
  padding: 7px;
  background-color: var(--color-primary);
  border-radius: 10px 10px 0 0;
  text-align: center;
`

const Wrapper = styled.div`
  width: 150px;
  height: 150px;
  transition: transform 0.3s ease-in-out;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      cursor: pointer;
      transform: scale(1.05);
    }
  }

  &,
  & img {
    border-radius: 0 0 10px 10px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 120px;
    max-height: 120px;
  }
`
