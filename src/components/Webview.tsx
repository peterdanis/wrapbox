import React, { useContext } from "react";
import { GlobalContext } from "./GlobalState";
import { Page } from "../wrapbox"; // eslint-disable-line import/no-unresolved
// import { WebviewTag } from "electron";

interface Props {
  id: Page["id"];
  src: Page["url"];
}

declare module "react" {
  interface WebViewHTMLAttributes<T>
    extends HTMLAttributes<HTMLWebViewElement> {
    enableremotemodule?: "false" | "true";
  }
}

export default function Webview(props: Props): React.ReactElement {
  const { activePage } = useContext(GlobalContext);
  const { id, src } = props;

  return (
    <webview
      enableremotemodule="false"
      src={src}
      style={{
        height: "100%",
        position: "absolute",
        visibility: activePage === id ? "visible" : "hidden",
        width: "100%",
      }}
    />
  );
}
