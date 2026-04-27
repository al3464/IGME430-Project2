const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect, useRef } = require('react');


const PomodoroTimer = ({ planId, onGiveup, onFinished }) => {
    const [timer, setTimer] = useState(1 * 60); //timer = total secs
    const [isTriggered, setIsTriggered] = useState(false);
    const modeRef = useRef('work');
    const [mode, setMode] = useState('working'); // set status to 'working' or 'rest'
    const intervalRef = useRef(null);

    //convert timer to right format to display on app
    const timerText = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


    const start = () => {
        pause();
        setIsTriggered(true);
        const startDate = Date.now();
        const startLeft = timer;
        intervalRef.current = setInterval(() => {//use setIterval() to repeat this function
            const timePass = Math.floor((Date.now() - startDate) / 1000);//mili secs convert to secs
            const timeLeft = startLeft - timePass;

            if (timeLeft <= 0) {
                pause();
                oneWeekCycle(); //record stats, switch mode

            } else {
                setTimer(timeLeft);
            }
        }, 1000);
    };

    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);//when mode switch to rest mode, update to mode "rest"

    const oneWeekCycle = async () => {

        console.log('oneWeekCycle invoked, mode=', mode);

        if (modeRef.current === 'working') {
            fetch('/finishPomodoro', {//recording pomodoro data
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId, duration: 25 }),
            }).then(() => {//recoridng done, switch to rest mode
                setMode('resting');
                setTimer(1 * 60);
                start();

                if (onFinished) {
                    onFinished();
                }

            }).catch(helper.handleError);
        } else {//if break done, switch to working mode
            setMode('working');
            setTimer(1 * 60);
            start();
        }
    }


    const pause = () => {//when pause been pressed, user clearInterval() to really stop counting
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsTriggered(false);
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

    //cancel the timer when user dont want to continue pomodoro
    const giveup = () => {
        pause();
        if (onGiveup && typeof onGiveup === 'function') {
            onGiveup();
        } else {
            console.warn('onGiveup is not a function');
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