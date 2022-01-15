import React from "react";
import ReactDOM from "react-dom";
import database from "./database";

import "./index.css";
import App from "./App";

database.init();
const auth = database.auth();
database.reqistry(auth);
database.authChangeListener(auth);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
