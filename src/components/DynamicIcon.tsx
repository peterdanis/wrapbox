import * as MaterialIcon from "mdi-material-ui";
import React from "react";

export type IconName = keyof typeof MaterialIcon;

interface Props {
  iconName: IconName | string;
}

export const availableIcons = Object.keys(MaterialIcon);

export default function DynamicIcon(props: Props): React.ReactElement {
  const { iconName } = props;
  // Keep iconName guard, in case icon names changes between "mdi-material-ui" versions
  // or users changes icon name manually in config file
  if (availableIcons.includes(iconName)) {
    const Icon = MaterialIcon[iconName as IconName];
    return <Icon />;
  }
  return <MaterialIcon.Help />;
}
