import '@/styles/globals.css'
import { MemberstackProvider } from "@memberstack/react";

export default function App({ Component, pageProps }) {
  return (
    <MemberstackProvider config={{
      publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_KEY
    }}>
      <Component {...pageProps} />
    </MemberstackProvider>
  )
}
