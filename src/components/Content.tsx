import { Paper, styled } from "@material-ui/core";
import React, { useContext } from "react";
import { GlobalContext } from "./GlobalState";

export default function Content(): React.ReactElement {
  // @ts-ignore TODO:remove comment
  const { activeTab, setActiveTab } = useContext(GlobalContext);

  const Background = styled(Paper)({
    height: "100%",
    position: "absolute",
    webkitAppRegion: "no-drag",
    // top: 32px;
    width: "100%",
  });

  const Webview = styled("webview")({
    height: "100%",
    position: "absolute",
    width: "100%",
  });

  return (
    <Background square>
      <Webview />
    </Background>
  );
}
