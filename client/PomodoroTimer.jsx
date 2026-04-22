const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect, useRef } = require('react');


const PomodoroTimer = ({taskId, onGiveup}) => {
    const [timer, setTimer] = useState(25 * 60); //timer = total secs
    const [isTriggered, setIsTriggered] = useState(false);
    const [mode, setMode] = useState('working'); // set status to 'working' or 'rest'
    const intervalRef = useRef(null);

    //convert timer to right format to display on app
    const timerText = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


    const start = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsTriggered(true);
        const startTimer = Date.now();
        const startLeft = timer;
        intervalRef.current = setInterval(() => {//use setIterval() to repeat this function
            const timePass = Math.floor((Date.now() - startTimer) / 1000);//mili secs convert to secs
            const timeLeft = startLeft - timePass;

            if (timeLeft <= 0) {
                clearInterval(intervalRef.current);
                setIsTriggered(false);//if time=0, time is up, stop counting
                if (mode === 'working') {
                    fetch('/finishPomodoro', {//recording pomodoro data
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ taskId, duration: 25 }),
                    }).then(() => {//recoridng done, switch to rest mode
                        setMode('rest');
                        setTimer(5 * 60);
                    }).catch(helper.handleError);
                } else {//if break done, switch to working mode
                    setMode('working');
                    setTimer(25 * 60);
                }
            } else {
                setTimer(timeLeft);
            }
        }, 1000);
    };

    const pause = () => {//when pause been pressed, user clearInterval() to really stop counting
        clearInterval(intervalRef.current);
        setIsTriggered(false);//seitch pasue to start
    };

    const reset = () => {
        clearInterval(intervalRef.current);
        setIsTriggered(false);//switch pause to start
        if (mode === 'working') {
            setTimer(25 * 60);
        } else {
            setTimer(5 * 60);
        }
    };

    const giveup = () => {

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        
        }
        setIsTriggered(false);
        if (onGiveup && typeof onGiveup === 'function') {
            onGiveup();
        } else {
            console.warn('onCancel is not a function');
        }
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);//stop all the react component

    return (
        <div className="pomodoroTimer">
            <div className="timeMode">{mode === 'working' ? 'Working Time' : 'Time to have a break'}</div>
            <div className="timeDisplay">{timerText(timer)}</div>
            <div className="timeControls">
                {!isTriggered ? (
                    <button onClick={start}>Start</button>
                ) : (
                    <button onClick={pause}>Pause</button>
                )}
                <button onClick={reset}>Reset</button>
                <button onClick={giveup}>Give up</button>
            </div>
        </div>
    );
};

module.exports = PomodoroTimer;