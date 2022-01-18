import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import database from "../database";

import { addUsers } from "../store/users";

const useFetchData = ({ updateCallback = () => {} } = {}) => {
    const users = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const { roomId } = useParams();
  
    const updatedData = (newData) => {
      if (!newData) return null;
      dispatch(addUsers(newData.users));
      updateCallback(newData);
    };
  
    useEffect(() => {
      if (!users.data && roomId) {
        database.listenerData({ path: `rooms/${roomId}`, updatedData });
      }
    }, [users]);
}

export default useFetchData;