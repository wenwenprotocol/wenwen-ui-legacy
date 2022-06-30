import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'

interface CountdownProps {
  deadline: string
}

const Countdown: React.FC<CountdownProps> = ({ deadline }) => {
  const prefix = (num: number) => (num / Math.pow(10, 2)).toFixed(2).substr(2)

  const [isShow, setIsShow] = useState(false)
  const [time, setTime] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })

  let interval: ReturnType<typeof setInterval>

  const countdown = useCallback(() => {
    const countdownDate = new Date(deadline).getTime()
    const now = Date.now()
    const distance = countdownDate - now

    if (distance > 0) {
      setIsShow(true)
    } else {
      clearInterval(interval)
      interval = null

      setIsShow(false)
    }

    const days = prefix(Math.floor(distance / (1000 * 60 * 60 * 24)))
    const hours = prefix(Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ))
    const minutes = prefix(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
    const seconds = prefix(Math.floor((distance % (1000 * 60)) / 1000))

    setTime({ days, hours, minutes, seconds })
  }, [deadline])

  useEffect(() => {
    if (deadline) {
      countdown()
    }

    interval = setInterval(countdown, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  return (<>
    { isShow ? (
      <StyledMod>
        <StyledItem>
          <StyledNumber>{time.days} </StyledNumber>
          <StyledText>Day</StyledText>
        </StyledItem>
        <StyledColon>:</StyledColon>
        <StyledItem>
          <StyledNumber>{time.hours} </StyledNumber>
          <StyledText>Hour</StyledText>
        </StyledItem>
        <StyledColon>:</StyledColon>
        <StyledItem>
          <StyledNumber>{time.minutes} </StyledNumber>
          <StyledText>Minute</StyledText>
        </StyledItem>
        <StyledColon>:</StyledColon>
        <StyledItem>
          <StyledNumber>{time.seconds} </StyledNumber>
          <StyledText>Second</StyledText>
        </StyledItem>
      </StyledMod >) : null}
  </>
  )
}

const StyledMod = styled.div`
  color: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const StyledItem = styled.div`
  text-align: center;
`

const StyledNumber = styled.div`
  font-family: 'DDIN';
  color: #fff;
  font-weight: 500;
  font-size: 80px;
  line-height: 1.2;
`

const StyledText = styled.div`
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
  color: #A8B0C1;
`

const StyledColon = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: #FFFFFF;
  margin: 0 10px;
`

export default Countdown