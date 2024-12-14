import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function TestTimer() {
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Make startTimer available globally
    window.startTimer = (sessionId) => {
      console.log('Timer start triggered with sessionId:', sessionId);
      if (timerStarted) {
        console.log('Timer already started');
        return;
      }

      fetch('/api/start-timer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          memberId: 'test'
        })
      })
      .then(response => {
        console.log('Timer start response:', response);
        if (response.ok) {
          setTimerStarted(true);
          const id = setInterval(() => {
            setTimeRemaining(prev => {
              if (prev <= 1) {
                clearInterval(id);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          setTimerId(id);
        }
      })
      .catch(error => console.error('Error starting timer:', error));
    };

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerStarted]);

  return (
    <>
      <Head>
        <title>Timer Test</title>
      </Head>

      <div className="flex justify-center items-center min-h-screen">
        <div id="timer-container" className="text-center">
          <div id="timer-display" className="text-4xl font-bold">
            {formatTime(timeRemaining)}
          </div>
          {!timerStarted && (
            <div id="timer-waiting" className="text-purple-600 text-sm mt-2">
              Waiting to start...
            </div>
          )}
        </div>
      </div>
    </>
  );
}
