import { Divider } from "@material-ui/core";
import React from "react";

interface Props {
  margin?: number;
}

export default function VerticalDivider({
  margin = 7,
}: Props): React.ReactElement {
  // const { margin } = props;

  const style = {
    height: `calc(100% - ${2 * margin}px)`,
    marginBottom: `${margin}px`,
    marginTop: `${margin}px`,
  };

  return <Divider orientation="vertical" style={style} />;
}
