import ButtonBase from "@material-ui/core/ButtonBase";
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const buttonWidth = 30;

interface ElectronCSSProperties extends React.CSSProperties {
  WebkitAppRegion: string;
}

const divStyle: ElectronCSSProperties = {
  display: "flex",
  height: "inherit",
  WebkitAppRegion: "none",
  width: `${3 * buttonWidth}px`,
};

const iconStyle: React.CSSProperties = {
  margin: "auto",
  // width: "40%",
};

export default function WindowConstrols(): React.ReactElement {
  return (
    <div style={divStyle}>
      <SvgIcon style={iconStyle}>
        <path d="M14 8v1H3V8h11z" />
      </SvgIcon>
      <SvgIcon style={iconStyle}>
        <path d="M3 3v10h10V3H3zm9 9H4V4h8v8z" />
      </SvgIcon>
      <SvgIcon style={iconStyle}>
        <path d="M7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884L7.116 8z" />
      </SvgIcon>
    </div>
  );
}
