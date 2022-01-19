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

const Timer = ({ timeVoute = 0, resetTime }) => {
  const [time, setTime] = useState({ second: 0, minute: 1 });
  const [reset, setReset] = useState(resetTime);

  useEffect(() => {
    if (timerId) clearInterval(timerId);
    if (!timeVoute) return;

    if (resetTime || reset) {
      clearInterval(timerId);
      timerId = null;
      secondLeft = 0;
      setReset(false);
    }

    timerId = setInterval(() => {
      const clock = timeConvert(Number(timeVoute));

      setTime({ minute: getMinutes(clock), second: getSeconds(clock) });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [time, timeVoute, resetTime, reset]);

  useEffect(() => {
    if (timerId && time.second === 0 && time.minute === 0) {
      clearInterval(timerId);
    }
  }, [time]);

  return (
    <Time color={time.minute === 0 && time.second < 20 ? "red" : "black"}>
      {time.minute}:{time.second}
    </Time>
  );
};

Timer.propTypes = {
  timeVoute: PropTypes.number.isRequired,
  resetTime: PropTypes.bool,
};

Timer.defaultProps = {
  resetTime: false,
};

export default Timer;
