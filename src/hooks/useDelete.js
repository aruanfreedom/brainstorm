import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import database from "../database";
import { clearUserData } from "../store/user";
import { clearUsersData } from "../store/users";

export const useDelete = () => {
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteAll = useCallback(async () => {
    await database.writeData({
      path: `rooms/${users.adminId}`,
      data: { step: 0 },
    });

    await database.deleteData({
      path: `rooms/${users.adminId}`,
    });

    navigate("/");
    dispatch(clearUserData());
    dispatch(clearUsersData());
  }, [users]);

  const deleteUser = useCallback(() => {
    if (users.adminId === user.uid) {
      deleteAll();
    } else {
      database
        .removeFieldObject({
          path: `rooms/${users.adminId}`,
          data: { users: users.data },
          deleteFieldName: user.uid,
          pathField: "users",
        })
        .then(() => {
          navigate("/");
        });
    }
  }, [users, user]);

  return { deleteUser, deleteAll };
};
