import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import database from "../../../database";
import { addMember } from "../../../store/user";

const RoomWait = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    if (user.uid !== roomId && user.role !== "admin") {
      database
        .writeData({
          path: `rooms/${roomId}`,
          data: {
            users: {
              [user.uid]: {
                id: user.uid,
              },
            },
          },
        })
        .then(() => {
          dispatch(addMember());
        });
    }
  }, []);

  const updatedData = (newData) => {
    setUsers(newData.users);
  };

  useEffect(() => {
    database.listenerData({ path: `rooms/${roomId}`, updatedData });
  }, []);

  return (
    <>
      <div>
        Скопировать ссылку: <a href="">{window.location.href}</a>
      </div>
      <div>
        Количество подключенных: {users ? Object.keys(users).length : 0}
      </div>
    </>
  );
};

export default RoomWait;
