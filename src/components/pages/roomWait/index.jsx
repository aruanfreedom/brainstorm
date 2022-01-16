import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addMember } from "../../../store/user";

const RoomWait = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { roomId } = useParams();

  useEffect(() => {
    if (user.uid !== roomId && user.role !== "admin") {
      dispatch(addMember());
    }
  }, []);

  console.log(user, roomId);

  return <span>wait</span>;
};

export default RoomWait;
