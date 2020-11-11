import { ButtonBase, Tab, Tabs } from "@material-ui/core";
import React, { useContext } from "react";
import DynamicIcon from "./DynamicIcon";
import { ElectronCSSProperties } from "../wrapbox"; // eslint-disable-line import/no-unresolved
import { GlobalContext } from "./GlobalState";
import Paper from "@material-ui/core/Paper";
import Tune from "mdi-material-ui/Tune";
import VerticalDivider from "./VerticalDivider";
import WindowControls from "./WindowControls";

const rightDivStyle = {
  display: "flex",

  height: "inherit",
  width: "50px",
};

const topBarStyle: ElectronCSSProperties = {
  boxShadow: "inset 0 -1px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  height: "40px",
  justifyContent: "space-between",
  WebkitAppRegion: "drag",
};

const tabStyle: ElectronCSSProperties = {
  minHeight: "inherit",
  minWidth: "70px",
  WebkitAppRegion: "none",
};

const tabsStyle = {
  minHeight: "inherit",
};

const settingsButtonStyle: ElectronCSSProperties = {
  height: "25px",
  maxWidth: "30px",
  WebkitAppRegion: "none",
  width: "30px",
};

// TODO: delete div and extract "height"
export default function TopBar(): React.ReactElement {
  const { activePage, pages, setActivePage } = useContext(GlobalContext);

  return (
    <Paper square style={topBarStyle}>
      <div style={rightDivStyle}>
        <ButtonBase style={settingsButtonStyle}>
          <Tune color="primary" />
        </ButtonBase>
      </div>
      {/* <div style={divStyle}> */}
      {/* </div> */}
      {/* <VerticalDivider /> */}
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
      <WindowControls />
    </Paper>
  );
}
