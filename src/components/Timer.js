import { useEffect, useState } from 'react';
import { useMemberstack } from "@memberstack/react";

export default function Timer() {
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [isWaiting, setIsWaiting] = useState(true);
  const { auth } = useMemberstack();
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Prevent caching
    if (performance.getEntriesByType("navigation")[0].type === 'back_forward') {
      window.location.replace('/credits');
    }

    // Prevent browser back/forward navigation
    window.history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.pushState(null, null, location.href);
      window.location.replace('/sales-arena');
    };

    // Make startTimer available globally
    window.startTimer = async (sessionId) => {
      try {
        const member = await auth.getCurrentMember();
        
        if (!member) {
          window.location.replace('/');
          return;
        }

        const response = await fetch('/api/start-timer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: sessionId,
            memberId: member.id
          })
        });

        if (response.ok) {
          setIsWaiting(false);
          
          // Start countdown
          const timerId = setInterval(() => {
            setTimeRemaining((prev) => {
              if (prev <= 1) {
                clearInterval(timerId);
                window.location.replace('/sales-arena');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          // Auto-redirect after 10 minutes
          setTimeout(() => {
            window.location.replace('/sales-arena');
          }, 600000);

          return () => clearInterval(timerId);
        }
      } catch (error) {
        console.error('Error starting timer:', error);
      }
    };

    return () => {
      // Cleanup if needed
    };
  }, [auth]);

  return (
    <div id="timer-container" className="flex flex-col items-center gap-4">
      <div 
        id="timer-display" 
        className="text-4xl font-bold font-montserrat"
        style={{ color: timeRemaining <= 60 ? 'red' : 'black' }}
      >
        {formatTime(timeRemaining)}
      </div>
      {isWaiting && (
        <div id="timer-waiting" className="text-purple-600 text-sm mt-2">
          Waiting to start...
        </div>
      )}
    </div>
  );
}
