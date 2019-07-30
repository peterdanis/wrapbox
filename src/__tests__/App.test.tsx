import "../electron/preload";
import App from "../components/App";
import { GlobalState } from "../components/GlobalState";
import React from "react";
import ReactDOM from "react-dom";

jest.mock("electron");

it("renders without crashing", () => {
  const div = document.createElement("div");
  div.id = "root";
  document.body.appendChild(div);
  ReactDOM.render(
    <GlobalState>
      <App />
    </GlobalState>,
    document.getElementById("root"),
  ),
    ReactDOM.unmountComponentAtNode(div);
});
