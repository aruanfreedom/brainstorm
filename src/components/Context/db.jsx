import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import database from "../../database";
import { addAdminId, addUsers } from "../../store/users";
import { addSheets, addSheetNumber } from "../../store/lists";
import { useGetId } from "../../helpers/generateId";

export const DbContext = React.createContext();

export const DatabaseContext = ({ children }) => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const roomId = useGetId();

  const subscribe = (newData) => {
    if (!newData) return null;
    dispatch(addUsers(newData.users));
    dispatch(addAdminId(newData.adminId));
    dispatch(addSheets(newData.sheets));
    if ("sheetNumber" in newData) dispatch(addSheetNumber(newData.sheetNumber));
    setData(newData);
  };

  useEffect(() => {
    if (roomId) {
      database.listenerData({
        path: `rooms/${roomId}`,
        subscribe,
      });
    }
  }, [roomId]);

  return <DbContext.Provider value={data}>{children}</DbContext.Provider>;
};

DatabaseContext.propTypes = {
  children: PropTypes.node.isRequired,
};
