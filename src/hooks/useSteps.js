import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../constants";
import database from "../database";

export const useSteps = () => {
  const [step, setStep] = useState(null);
  const adminId = useSelector((state) => state.users.adminId);
  const navigation = useNavigate();

  const subscribe = (newData) => {
    if (!newData) return null;
    setStep(newData.step);
  };

  useEffect(() => {
    if (adminId) {
      database.listenerData({ path: `rooms/${adminId}`, subscribe });
    }
  }, [adminId]);

  useEffect(() => {
    switch (PAGES[step]) {
      case PAGES[0]:
        navigation(`/`);
        break;
      case PAGES[1]:
        navigation(`roomWait/${adminId}`);
        break;
      case PAGES[2]:
        navigation(`room/${adminId}`);
        break;
      case PAGES[3]:
        navigation(`rating/${adminId}`);
        break;
      case PAGES[4]:
        navigation(`total/${adminId}`);
        break;
      default:
        break;
    }
  }, [step]);
};
