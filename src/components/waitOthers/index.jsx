import React, { useContext } from "react";
import PropTypes from "prop-types";
import { DbContext } from "../Context/db";

const WaitOthers = ({ status }) => {
  const dbProps = useContext(DbContext);
  const users = dbProps?.users;

  const notReady = users && Object.values(users).filter(({ done }) => !done);

  return status ? (
    <div>
      <h4>Ожидаем участников:</h4>
      {notReady.map(({ name, lastName }) => (
        <p key={name + lastName}>
          <span>{name}</span> <span>{lastName}</span>
        </p>
      ))}
    </div>
  ) : null;
};

WaitOthers.defaultProps = {
  status: false,
};

WaitOthers.propTypes = {
  status: PropTypes.bool,
};

export default WaitOthers;
