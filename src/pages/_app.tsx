import { AppProps } from 'next/app'
import { Providers } from '../setup/providers'
import { fraunces } from '@/setup/fonts'
import './app.css'
import { Navigation } from '@/shared/ui/navigation'

function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <main>
        <Navigation />
        <Component {...pageProps} />
      </main>
    </Providers>
  )
}

export default App
