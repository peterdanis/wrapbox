import "typeface-roboto/files/roboto-latin-300.woff2";
import "typeface-roboto/files/roboto-latin-400.woff2";
import "typeface-roboto/files/roboto-latin-500.woff2";
import App from "./components/App";
import { GlobalState } from "./components/GlobalState";
import React from "react";
import ReactDOM from "react-dom";

document.body.style.margin = "0";
document.body.style.fontFamily = "Roboto";

ReactDOM.render(
  <GlobalState>
    <App />
  </GlobalState>,
  document.getElementById("root"),
);
