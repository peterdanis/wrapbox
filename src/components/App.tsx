import React, { Fragment } from "react";
import { styled } from "@material-ui/styles";
import TopBar from "./TopBar";

const Content = styled("div")({
  webkitAppRegion: "no-drag",
  // position: fixed;
  // top: 32px;
  // width: 100%;
  // height: calc(100% - 32px);
});

const Webview = styled("webview")({
  height: "100%",
  position: "absolute",
  width: "100%",
});

export default function App(): React.ReactElement {
  return (
    <Fragment>
      <TopBar />
      <Content>
        <Webview />
      </Content>
    </Fragment>
  );
}
