import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { add, getMinutes, getSeconds } from "date-fns";
import styled from "styled-components";

let timerId = 0;
let secondLeft = 0;

const timeConvert = function (minutes) {
  const endtime = add(new Date("00"), { minutes });
  secondLeft = secondLeft - 1;
  const result = add(endtime, { seconds: secondLeft });
  return result;
};

const Time = styled.span`
  font-weight: bold;
  color: ${({ color }) => color};
`;

const Timer = ({ timeVoute, resetTime }) => {
  const [time, setTime] = useState({ second: 0, minute: 1 });
  const [reset, setReset] = useState(resetTime);

  const timeConvert = () => {
    const timeFromStorage = localStorage.getItem("time");

    if (timeFromStorage) {
      const minutes = getMinutes(new Date(Number(timeFromStorage)));
      const second = getSeconds(new Date(Number(timeFromStorage)));

      const endtime =
        minutes === 0
          ? new Date("00")
          : add(new Date("00"), { minutes: minutes ? minutes : timeVoute });

      console.log(endtime, new Date("00"));
      console.log(minutes, second);

      setSecondLeft(() => second - 1);
      const result = add(endtime, { seconds: second - 1 });
      return result;
    } else {
      secondLeft = secondLeft - 1;
    }
  };

  const clear = () => {
    if (resetTime || reset) {
      clearTimeout(timerId);
      timerId = null;
      secondLeft = 0;
      setReset(false);
    }
  };

  useEffect(() => {
    if (timerId) clearTimeout(timerId);
    if (!timeVoute) return;

    clear();

    timerId = setTimeout(() => {
      const clock = timeConvert(Number(timeVoute));

      if (time.second === 0 && time.minute === 0) {
        clearTimeout(timerId);
      } else {
        setTime({ minute: getMinutes(clock), second: getSeconds(clock) });
      }
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [time, timeVoute, resetTime, reset]);

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
