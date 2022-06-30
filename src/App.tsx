import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { UseWalletProvider } from 'use-wallet'
import DisclaimerModal from './components/DisclaimerModal'
import MobileMenu from './components/MobileMenu'
import TopBar from './components/TopBar'
import FarmsProvider from './contexts/Farms'
import CashesProvider from './contexts/Cashes'
import ModalsProvider from './contexts/Modals'
import TransactionProvider from './contexts/Transactions'
import SushiProvider from './contexts/SushiProvider'
import useModal from './hooks/useModal'
import theme from './theme'
import Pools from './views/Pools'
import Status from './views/Status'
import Swap from './views/Swap'
import Claim from './views/Claim'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { getRpcUrl, getSupportedChainId } from './utils/chain'

const App: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleDismissMobileMenu = useCallback(
    () => {
      setMobileMenu(false)
    },
    [setMobileMenu]
  )

  const handlePresentMobileMenu = useCallback(
    () => {
      setMobileMenu(true)
    },
    [setMobileMenu]
  )

  return (
    <Providers>
      <Router>
        <Helmet 
          titleTemplate="WENWEN Protocol - %s"
          defaultTitle="WENWEN Protocol - Decentralized Stablecoin with an Algorithmic Central Bank"
        />
        <TopBar onPresentMobileMenu={handlePresentMobileMenu} />
        <MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} />
        <Switch>
          <Route path="/" exact>
            <Swap />
          </Route>
          <Route path="/farm">
            <Pools />
          </Route>
          <Route path="/analytics">
            <Status />
          </Route>
          <Route path="/stake">
            <Claim />
          </Route>
        </Switch>
      </Router>
    </Providers>
  )
}

const Providers: React.FC = ({ children }) => {
  const supportedChainId = getSupportedChainId()
  const rpc = getRpcUrl(supportedChainId)
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <UseWalletProvider
          connectors={{
            walletconnect: {
              chainId: supportedChainId,
              rpcUrl: rpc,
            }
          }}
        >
          <SushiProvider>
            <TransactionProvider>
              <FarmsProvider>
                <CashesProvider>
                  <ModalsProvider>{children}</ModalsProvider>
                </CashesProvider>
              </FarmsProvider>
            </TransactionProvider>
          </SushiProvider>
        </UseWalletProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

const Disclaimer: React.FC = () => {
  const markSeen = useCallback(() => {
    localStorage.setItem('disclaimer', 'seen')
  }, [])

  const [onPresentDisclaimerModal] = useModal(<DisclaimerModal onConfirm={markSeen} />)

  useEffect(
    () => {
      const seenDisclaimer = false //localStorage.getItem('disclaimer')
      if (!seenDisclaimer) {
        onPresentDisclaimerModal()
      }
    },
    [onPresentDisclaimerModal]
  )

  return <div />
}

export default App
