import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../constants";
import database from "../database";
import { getId } from "../helpers/generateId";

export const useSteps = () => {
  const [step, setStep] = useState(null);
  const roomId = getId();
  const navigation = useNavigate();

  const subscribe = (newData) => {
    if (!newData) return null;
    setStep(newData.step);
  };

  useEffect(() => {
    if (roomId) {
      database.listenerData({ path: `rooms/${roomId}`, subscribe });
    }
  }, [roomId]);

  useEffect(() => {
    switch (PAGES[step]) {
      case PAGES[0]:
        navigation(`/`);
        break;
      case PAGES[1]:
        navigation(`roomWait/${roomId}`);
        break;
      case PAGES[2]:
        navigation(`room/${roomId}`);
        break;
      case PAGES[3]:
        navigation(`rating/${roomId}`);
        break;
      case PAGES[4]:
        navigation(`total/${roomId}`);
        break;
      default:
        break;
    }
  }, [step]);
};
