import React from "react";
import "./App.css";
import { IpcRenderer } from "electron"; // eslint-disable-line import/no-extraneous-dependencies
import Button from "@material-ui/core/Button";

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
  }
}

const ipcRenderer = window.ipcRenderer;

const App: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <p>Edit and save to reload.</p>
      <button
        type="button"
        onClick={() => {
          ipcRenderer.send("test", "argument");
        }}
      />
      <Button variant="contained" color="primary">
        Test button
      </Button>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);

export default App;
