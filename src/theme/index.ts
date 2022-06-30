import { black, green, grey, red, white } from './colors'

const theme = {
  borderRadius: 12,
  breakpoints: {
    mobile: 768,
    phone: 500,
  },
  color: {
    black,
    grey,
    primary: {
      main: green[500],
    },
    secondary: {
      main: red[500],
    },
    white,
    red
  },
  siteWidth: 1200,
  spacing: {
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 48,
    7: 64,
  },
  topBarSize: 72
}

export default theme
