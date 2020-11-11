import React, { useContext } from "react";
import DynamicIcon from "./DynamicIcon";
import { GlobalContext } from "./GlobalState";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import VerticalDivider from "./VerticalDivider";
import WindowControls from "./WindowControls";

const divStyle = {
  display: "flex",
  height: "inherit",
  width: "50px",
};

const topBarStyle = {
  boxShadow: "inset 0 -1px rgba(0, 0, 0, 0.05)",
  display: "flex",
  height: "40px",
  WebkitAppRegion: "drag",
};

const tabStyle = {
  minHeight: "inherit",
  minWidth: "80px",
  WebkitAppRegion: "none",
};

const tabsStyle = {
  minHeight: "inherit",
};

// TODO: delete div and extract "height"
export default function TopBar(): React.ReactElement {
  const { activePage, pages, setActivePage } = useContext(GlobalContext);

  return (
    <Paper square style={topBarStyle}>
      {/* <div style={divStyle}> */}
      <WindowControls />
      {/* </div> */}
      <VerticalDivider />
      <Tabs
        indicatorColor="primary"
        onChange={setActivePage}
        scrollButtons="on"
        style={tabsStyle}
        textColor="primary"
        value={activePage}
        variant="scrollable"
      >
        {Array.isArray(pages)
          ? pages.map((page) => {
              return (
                <Tab
                  disableRipple
                  icon={<DynamicIcon iconName={page.icon} />}
                  key={page.id}
                  style={tabStyle}
                  value={page.id}
                />
              );
            })
          : null}
      </Tabs>
    </Paper>
  );
}
