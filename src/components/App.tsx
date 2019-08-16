import Content from "./Content";
import React from "react";
import TopBar from "./TopBar";

export default function App(): React.ReactElement {
  return (
    <>
      <TopBar />
      <Content />
    </>
  );
}
