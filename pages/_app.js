import '@/styles/globals.css'
import { MemberstackProvider } from "@memberstack/react";

export default function App({ Component, pageProps }) {
  return (
    <MemberstackProvider config={{
      publicKey: "YOUR_MEMBERSTACK_PUBLIC_KEY"
    }}>
      <Component {...pageProps} />
    </MemberstackProvider>
  )
}
