import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../constants";
import database from "../database";

export const useSteps = () => {
  const [step, setStep] = useState(null);
  const adminId = useSelector((state) => state.users.adminId);
  const navigation = useNavigate();

  useEffect(() => {
    if (adminId) {
      database.getData({ path: `rooms/${adminId}` }).then((docSnap) => {
        if (docSnap.exists()) {
          setStep(docSnap.data().step);
        }
      });
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
