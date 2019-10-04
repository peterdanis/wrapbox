import React, { useContext } from "react";
import DynamicIcon from "./DynamicIcon";
import { GlobalContext } from "./GlobalState";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import VerticalDivider from "./VerticalDivider";

// TODO: delete div and extract "height"
export default function TopBar(): React.ReactElement {
  const { activePage, pages, setActivePage } = useContext(GlobalContext);
  const height = "40px";

  return (
    <Paper
      square
      style={{
        display: "flex",
        height,
      }}
    >
      <div
        style={{
          display: "flex",
          height,
          width: "50px",
        }}
      />
      <VerticalDivider />
      <Tabs
        value={activePage}
        onChange={setActivePage}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="on"
        style={{
          minHeight: height,
        }}
      >
        {Array.isArray(pages)
          ? pages.map(page => {
              return (
                <Tab
                  value={page.id}
                  key={page.id}
                  icon={<DynamicIcon iconName={page.icon} />}
                  disableRipple
                />
              );
            })
          : null}
      </Tabs>
    </Paper>
  );
}
