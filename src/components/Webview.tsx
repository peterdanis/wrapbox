import React, { useContext } from "react";
import { GlobalContext } from "./GlobalState";
import { Page } from "../wrapbox"; // eslint-disable-line import/no-unresolved

interface Props {
  id: Page["id"];
  src: Page["url"];
}

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface WebViewHTMLAttributes<T> {
    enableremotemodule?: "false" | "true";
  }
}

export default function Webview(props: Props): React.ReactElement {
  const { activePage } = useContext(GlobalContext);
  const { id, src } = props;
  const trueAsAny: any = "true"; // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <webview
      allowpopups={trueAsAny}
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
