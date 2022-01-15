import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import LayoutWrapper from "./components/layout";

import store from "./store";
import "antd/dist/antd.css";
import "./index.css";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <LayoutWrapper />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
