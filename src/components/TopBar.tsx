import React, { useContext } from "react";
import { GlobalContext } from "./GlobalState";
import { Paper } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

export default function TopBar(): React.ReactElement {
  const { activeTab, setActiveTab } = useContext(GlobalContext);

  const dummyTabs = ["A", "B", "C", "D", "E"];

  return (
    <Paper square>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="on"
      >
        {dummyTabs.map(tab => (
          <Tab key={tab} label={tab} disableRipple />
        ))}
      </Tabs>
    </Paper>
  );
}
