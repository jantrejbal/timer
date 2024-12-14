import Head from 'next/head';
import Timer from '@/components/Timer';
import { useEffect } from 'react';
import { useMemberstack } from "@memberstack/react";

export default function Home() {
  const { auth } = useMemberstack();

  useEffect(() => {
    const validateMember = async () => {
      try {
        const member = await auth.getCurrentMember();
        if (!member) {
          window.location.replace('/');
          return;
        }

        // Get access token from URL
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access');

        // Validate token against member session
        if (!accessToken || !member.customFields.session || accessToken !== member.customFields.session) {
          window.location.replace('/sales-arena');
          return;
        }

        // Clear session token
        await auth.updateMember({
          customFields: {
            session: null
          }
        });

        document.body.style.visibility = 'visible';
      } catch (error) {
        console.error('Error:', error);
        window.location.replace('/sales-arena');
      }
    };

    validateMember();
  }, [auth]);

  return (
    <>
      <Head>
        <title>Timer App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Timer />
        <div id="dynamic-frame"></div>
      </main>
    </>
  );
}
