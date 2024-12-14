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
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f0f0;
          }
          .timer-box {
            background-color: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .timer-display {
            font-size: 3rem;
            font-weight: bold;
            color: #333;
          }
          .waiting-message {
            color: #5b06be;
            font-size: 1rem;
            margin-top: 1rem;
          }
        `}</style>
      </Head>

      <div className="container">
        <div className="timer-box">
          <div className="timer-display">
            {formatTime(timeRemaining)}
          </div>
          {!timerStarted && (
            <div className="waiting-message">
              Waiting to start... 
              <br />
              Open console (F12) and run: window.startTimer('123')
            </div>
          )}
        </div>
      </div>
    </>
  );
}
