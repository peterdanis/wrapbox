import "typeface-roboto/files/roboto-latin-300.woff2";
import "typeface-roboto/files/roboto-latin-400.woff2";
import "typeface-roboto/files/roboto-latin-500.woff2";
import Content from "./Content";
import { GlobalState } from "./GlobalState";
import React from "react";
import TopBar from "./TopBar";

document.body.style.margin = "0";
document.body.style.fontFamily = "Roboto";

export default function App(): React.ReactElement {
  return (
    <GlobalState>
      <TopBar />
      <Content />
    </GlobalState>
  );
}
