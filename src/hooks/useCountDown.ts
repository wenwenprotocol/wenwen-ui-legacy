import { useEffect, useState } from 'react'

export interface CountDownTime {
  hours: number
  minutes: number
}

const useCountDown = (refTime: number) => {
  const [time, setTime] = useState<CountDownTime>({ hours: 0, minutes: 0})

  const calculate = () => {
    const now = new Date()
    const utcHours = now.getUTCHours()
    const utcMinutes = now.getUTCMinutes()

    let hours
    if (utcHours < refTime) {
      hours = utcMinutes > 0 ? refTime - utcHours - 1 : refTime - utcHours
    }
    else {
      hours = utcMinutes > 0 ? 23 - utcHours + refTime : 24 - utcHours + refTime
    }
    const minutes = utcMinutes > 0 ? 60 - utcMinutes : 0

    setTime({ hours, minutes })
  }

  useEffect(() => {
    calculate()

    const id = setInterval(async () => {
      calculate()
    }, 60000)

    return () => clearInterval(id)
  }, [])

  return time
}

export default useCountDown

