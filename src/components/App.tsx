import React, { Fragment } from "react";
import TopBar from "./TopBar";

export default function App(): React.ReactElement {
  return (
    <Fragment>
      <TopBar />
      <div id="content">
        <webview className="webview" />
      </div>
    </Fragment>
  );
}
