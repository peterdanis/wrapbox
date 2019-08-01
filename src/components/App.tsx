import React, { Fragment } from "react";
import Content from "./Content";
import TopBar from "./TopBar";

export default function App(): React.ReactElement {
  return (
    <Fragment>
      <TopBar />
      <Content />
    </Fragment>
  );
}
