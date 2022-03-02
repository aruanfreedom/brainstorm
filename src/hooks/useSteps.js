import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { PAGES } from "../constants";
import database from "../database";
import { useGetId } from "../helpers/generateId";
import { clearUserData } from "../store/user";
import { clearUsersData } from "../store/users";

export const useSteps = () => {
  const [step, setStep] = useState(null);
  const roomId = useGetId();
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const subscribe = (newData) => {
    if (!newData) return null;
    setStep(newData.step);
  };

  useEffect(() => {
    if (roomId) {
      database.listenerData({ path: `rooms/${roomId}`, subscribe });
    }
  }, [roomId]);

  useEffect(async () => {
    if (step === null) {
      dispatch(clearUserData());
      dispatch(clearUsersData());
      localStorage.removeItem("roomId");
      localStorage.removeItem("time");
    }
  }, []);

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
