import React from 'react'
import styled from 'styled-components'

export interface TooltipBoxProps {
  placement?: 'left' | 'right' | 'top' | 'bottom'
  markSize?: string
}

interface TooltipProps extends TooltipBoxProps {
  children?: React.ReactNode
  tip: string | React.ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ children, tip, placement = 'bottom', markSize }) => (
  <TooltipCard>
    <TooltipText markSize={markSize}>
      {children}
    </TooltipText>
    <TooltipBox placement={placement}>
      {tip}
    </TooltipBox>
  </TooltipCard>
)

interface TooltipTextProps {
  markSize?: string
}

const TooltipText = styled.div<TooltipTextProps>`
  background: #A8B0C1;
  color: #fff;
  text-align: center;
  height: ${props => props.markSize || '16px'};
  width: ${props => props.markSize || '16px'};
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  font-weight: bold;
`

const TooltipBox = styled.div<TooltipBoxProps>`
  position: absolute;
  ${props => {
    const { placement } = props
    let top, left, arrowTop, arrowLeft, arrowRotate
    switch (placement) {
      case 'left':
        top = 'calc(-100% - 5px)'
        left = 'calc(-100% - 215px)'
        arrowTop = 'calc(50% - 5px)'
        arrowLeft = '210px'
        arrowRotate = '225'
        break
      case 'right':
        top = 'calc(-100% - 5px)'
        left = 'calc(100% + 15px)'
        arrowTop = 'calc(50% - 5px)'
        arrowLeft = '-5px'
        arrowRotate = '45'
        break  
      case 'top':
        top = 'calc(-200% - 15px)'
        left = '-100px'
        arrowTop = 'calc(100% - 5px)'
        arrowLeft = '102px'
        arrowRotate = '-45'
        break
      case 'bottom':
      default:
        top = 'calc(100% + 15px)'
        left = '-100px'
        arrowTop = '-5px'
        arrowLeft = '102px'
        arrowRotate = '135'
    }
    return `
      top: ${top};
      left: ${left};
      &:before {
        left: ${arrowLeft};
        top: ${arrowTop};
        transform: rotate(${arrowRotate}deg);        
      }
    `
  }}
  visibility: hidden;
  color: transparent;
  background-color: transparent;
  width: 200px;
  text-align: left;
  line-height: 1.5;
  padding: 5px 5px;
  border-radius: 4px;
  transition: visibility 0.1s, color 0.1s, background-color 0.1s, width 0.1s,
    padding 0.1s ease-in-out;
  &:before {
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    border: 5px solid transparent;
    transition: border 0.1s ease-in-out;
  }
  text-transform: none;
`

const TooltipCard = styled.div`
  position: relative;
  & ${TooltipText}:hover + ${TooltipBox} {
    visibility: visible;
    color: #fff;
    background-color: rgba(14,13,22,0.8);
    padding: 8px 8px;
    &:before {
      border-color: transparent transparent rgba(14,13,22,0.8)
      rgba(14,13,22,0.8);
    }
  }
`
export default Tooltip