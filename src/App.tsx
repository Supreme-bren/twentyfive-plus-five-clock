import { useState, useEffect } from 'react'
import { DisplayState } from './helpers';
import './App.css'
import TimeSetter from "./TimeSetter"
import Display from './Display';
import AlarmSound from "/Alarm sound.mp3"

const defaultBreakTime = 5 * 60;
const defaultSessionTime = 25 *60;
const min = 60;
const max = 60 * 60;
const interval = 60;

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [sessionTime, setSessionTime] = useState(defaultSessionTime);
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    timerRunning: false,
  });

  useEffect(() => {
    let tId: number;
    if(!displayState.timerRunning) return;

    if(displayState.timerRunning){
      tId = window.setInterval(decrement, 100);
    }

    return () =>{
      window.clearInterval(tId);
    }
  }, [displayState.timerRunning])

  useEffect(() =>{
    if(displayState.time ===0){
      const aud = document.getElementById("beep") as HTMLAudioElement;
      aud.currentTime = 3;
      aud.play().catch((error) => console.log(error));
      setDisplayState((prev) =>({
        ...prev,
        timeType: prev.timeType === "Session" ? "Break" : "Session",
        time: prev.timeType === "Session" ? breakTime : sessionTime
      }))
    }
  }, [displayState.time])

  const reset = () =>{
    setBreakTime(defaultBreakTime);
    setSessionTime(defaultSessionTime);
    setDisplayState({
      time: defaultSessionTime,
      timeType: "Session",
      timerRunning: false
    });
    const audio = document.getElementById("beep") as HTMLAudioElement;
    audio.pause;
    audio.currentTime = 0;
  };

  const startStop = () =>{
    setDisplayState((prev) => ({
      ...prev,
      timerRunning: !prev.timerRunning
    }) )
  };

  const changeBreakTime =(time: number) =>{
    if(displayState.timerRunning) return;
    setBreakTime(time);
  };

  const decrement = () =>{
      setDisplayState((prev) => ({
        ...prev,
        time: prev.time - 1
      }))
  }

  const changeSessionTime = (time: number) => {
    if(displayState.timerRunning) return;
    setSessionTime(time);
    setDisplayState({
      time: time,
      timeType: "Session",
      timerRunning: false
    })
  };

  return (
    <>
      <div className="clock">
        <div className="setters">
          <div className="break">
            <h4 id="break-label">Break Length</h4>
            <TimeSetter
            time={breakTime}
            setTime = {changeBreakTime}
            min = {min}
            max = {max}
            interval = {interval}
            type = "break"
            />
          </div>
          <div className="session">
            <h4 id="session-label">Session Length</h4>
            <TimeSetter
            time={sessionTime}
            setTime = {changeSessionTime}
            min = {min}
            max = {max}
            interval = {interval}
            type = "session"
            />
          </div>
        </div>
        <Display
          displayState={displayState}
          reset={reset}
          startStop={startStop}
        />
        <audio id="beep" src={AlarmSound} />
      </div>
    </>
  )
}

export default App
