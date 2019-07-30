import React, { createContext, useEffect, useState, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  activeTab: number;
  setActiveTab: Function;
}

// @ts-ignore
export const GlobalContext = createContext<State>();

export const GlobalState: React.FunctionComponent = (props: Props) => {
  const { children } = props;
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    console.log(window.ipcRenderer.sendSync("getAllSettings")); // eslint-disable-line
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        activeTab,
        setActiveTab: (event: Event, number: number) => {
          setActiveTab(number);
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
