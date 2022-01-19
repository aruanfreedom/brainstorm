import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import database from "../../database";
import { addUsers } from "../../store/users";

export const DbContext = React.createContext();

export const DatabaseContext = ({ children }) => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const { roomId } = useParams();

  const updatedData = (newData) => {
    if (!newData) return null;
    dispatch(addUsers(newData.users));
    setData(newData);
  };

  useEffect(() => {
    if (roomId) {
      database.listenerData({ path: `rooms/${roomId}`, updatedData });
    }
  }, [roomId]);

  return <DbContext.Provider value={data}>{children}</DbContext.Provider>;
};

DatabaseContext.propTypes = {
  children: PropTypes.node.isRequired,
};