import "./App.css";
import React, { useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar"; // eslint-disable-line import/no-extraneous-dependencies
import { makeStyles } from "@material-ui/core/styles"; // eslint-disable-line import/no-extraneous-dependencies
import Tab from "@material-ui/core/Tab"; // eslint-disable-line import/no-extraneous-dependencies
import Tabs from "@material-ui/core/Tabs"; // eslint-disable-line import/no-extraneous-dependencies

export default function App(): React.ReactElement {
  const [value, setValue] = useState(0);

  const useStyles = makeStyles({
    root: {
      flexGrow: 1,
    },
  });

  const classes = useStyles();

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number,
  ): void => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log(window.ipcRenderer.sendSync("getAllSettings")); // eslint-disable-line
  }, []);

  return (
    <React.Fragment>
      <AppBar position="static" color="default" className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
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
      <div id="content">
        <webview className="webview" />
      </div>
    </React.Fragment>
  );
}
