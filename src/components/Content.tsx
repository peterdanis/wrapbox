import { Paper, styled } from "@material-ui/core";
import React, { useContext } from "react";
import { GlobalContext } from "./GlobalState";

export default function Content(): React.ReactElement {
  const { activePage, pages } = useContext(GlobalContext);

  const Background = styled(Paper)({
    height: "calc(100% - 48px)",
    position: "absolute",
    webkitAppRegion: "no-drag",
    width: "100%",
  });

  const Webview = styled("webview")({
    height: "100%",
    position: "absolute",
    width: "100%",
  });

  return (
    <Background square>
      <Webview src={pages.filter(page => page.id === activePage)[0].url} />
    </Background>
  );
}
