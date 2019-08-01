import React, { useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import { GlobalContext } from "./GlobalState";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

export default function TopBar(): React.ReactElement {
  const { activeTab, setActiveTab } = useContext(GlobalContext);

  const useStyles = makeStyles({
    root: {
      flexGrow: 1,
    },
  });

  const classes = useStyles();

  return (
    <AppBar position="static" color="default" className={classes.root}>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="on"
      >
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
        <Tab label="Item Four" />
        <Tab label="Item Five" />
        <Tab label="Item Six" />
        <Tab label="Item Seven" />
      </Tabs>
    </AppBar>
  );
}
