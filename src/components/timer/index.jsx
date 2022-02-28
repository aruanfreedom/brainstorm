import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { add, getMinutes, getSeconds } from "date-fns";
import styled from "styled-components";

let timerId = 0;

const Time = styled.span`
  font-weight: bold;
  color: ${({ color }) => color};
`;

const Timer = ({ timeVoute, resetTime }) => {
  const [secondLeft, setSecondLeft] = useState(0);
  const [time, setTime] = useState({ second: null, minute: null });

  const playAudio = () => {
    const audio = new Audio(
      "https://zvukitop.com/wp-content/uploads/2021/09/the-end-4.mp3"
    );
    audio.play();
  };

  const timerInit = () => {
    const endtime = add(new Date("00"), { minutes: Number(timeVoute) });
    setSecondLeft(() => secondLeft - 1);
    const result = add(endtime, { seconds: secondLeft });
    return result;
  };

  const timerStorageConvert = (timeFromStorage) => {
    const minutes = getMinutes(new Date(Number(timeFromStorage)));
    const second = getSeconds(new Date(Number(timeFromStorage)));

    if (minutes === 0 && second === 0) return new Date("00");

    const endtime =
      minutes === 0
        ? new Date("00")
        : add(new Date("00"), { minutes: minutes ? minutes : timeVoute });

    setSecondLeft(() => second - 1);
    const result = add(endtime, { seconds: second - 1 });
    return result;
  };

  const timeConvert = () => {
    const timeFromStorage = localStorage.getItem("time");
    return timeFromStorage ? timerStorageConvert(timeFromStorage) : timerInit();
  };

  const startTimer = useCallback(() => {
    if (timerId) clearInterval(timerId);
    if (!timeVoute) return;

    timerId = setInterval(() => {
      const clock = timeConvert();

      if (time.second === 0 && time.minute === 0) {
        playAudio();
        clearInterval(timerId);
      } else {
        localStorage["time"] = clock.getTime();
        setTime({ minute: getMinutes(clock), second: getSeconds(clock) });
      }
    }, 1000);
  }, [time.second, time.minute, timeVoute, resetTime, resetTime]);

  useEffect(() => {
    if (resetTime) {
      setTime({ minutes: null, seconds: null });
      localStorage.removeItem("time");
    }
    startTimer();
  }, [timeVoute, time, resetTime]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("time");
    };
  }, []);

  if (time.second === null && time.minute === null) {
    return <strong>load...</strong>;
  }

  return (
    <Time color={time.minute === 0 && time.second < 20 ? "red" : "black"}>
      {time.minute}:{time.second}
    </Time>
  );
};

Timer.propTypes = {
  timeVoute: PropTypes.number,
  resetTime: PropTypes.bool,
};

Timer.defaultProps = {
  resetTime: false,
  timeVoute: 0,
};

export default Timer;
