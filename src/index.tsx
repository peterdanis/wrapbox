import App from "./components/app/App";
import { GlobalState } from "./components/GlobalState";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <GlobalState>
    <App />
  </GlobalState>,
  document.getElementById("root"),
);
