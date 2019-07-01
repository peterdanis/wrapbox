import "./App.css";
import Button from "@material-ui/core/Button"; // eslint-disable-line import/no-extraneous-dependencies
import { IpcRenderer } from "electron";
import React from "react";

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
  }
}

class App extends React.Component {
  state = {
    showButton: false,
  };

  render(): React.ReactElement {
    const { showButton } = this.state;

    return (
      <React.Fragment>
        {showButton ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.ipcRenderer.send("test", "argument");
            }}
          >
            Test button
          </Button>
        ) : null}
        <div id="content">
          <webview className="webview" />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
