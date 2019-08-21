import React, { useContext } from "react";
import { GlobalContext } from "./GlobalState";
import Paper from "@material-ui/core/Paper";
import Webview from "./Webview";

export default function Content(): React.ReactElement {
  const { pages } = useContext(GlobalContext);

  return (
    <Paper
      square
      style={{
        height: "calc(100% - 48px)",
        position: "absolute",
        width: "100%",
      }}
    >
      {Array.isArray(pages)
        ? pages.map(page => {
            return <Webview id={page.id} key={page.id} src={page.url} />;
          })
        : null}
    </Paper>
  );
}
