import React from "react";
import { DbContext } from "../context/db";

const themeBrainstorm = () => {
  const dbProps = React.useContext(DbContext);

  const titleBrainstrom = dbProps?.settings?.titleBrainstrom;

  return (
    <h4>
      Тема мозгового штурма: <strong>{titleBrainstrom}</strong>
    </h4>
  );
};

export default themeBrainstorm;
