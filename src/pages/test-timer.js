<!DOCTYPE html>
<html>
<head>
    <title>Timer Test</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        #timer-container {
            text-align: center;
            font-size: 2rem;
        }
        #timer-waiting {
            color: #5b06be;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div id="timer-container">
        <div id="timer-display"></div>
        <div id="timer-waiting">Waiting to start...</div>
    </div>

    <script>
        let timeRemaining = 600;
        let timerId;
        let timerStarted = false;

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        function updateTimer() {
            if (timeRemaining <= 0) {
                clearInterval(timerId);
                document.getElementById('timer-display').textContent = "Time's up!";
                return;
            }
            document.getElementById('timer-display').textContent = formatTime(timeRemaining);
            timeRemaining--;
        }

        // Initialize display
        document.getElementById('timer-display').textContent = formatTime(timeRemaining);

        window.startTimer = function(sessionId) {
            if (timerStarted) return;
            if (sessionId !== '123') {
                console.log('Invalid session ID');
                return;
            }
            
            console.log('Starting timer with session ID:', sessionId);
            timerStarted = true;
            document.getElementById('timer-waiting').remove();
            timerId = setInterval(updateTimer, 1000);
        };
    </script>
</body>
</html>
