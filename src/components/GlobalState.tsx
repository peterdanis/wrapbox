import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Page } from "../wrapbox";

interface Props {
  children?: ReactNode;
}

interface State {
  activePage: string;
  pages: Page[];
  setActivePage(value: string): void;
}

// @ts-ignore TODO: check ignore
export const GlobalContext = createContext<State>();

export const GlobalState: React.FunctionComponent = (props: Props) => {
  const { children } = props;
  const [pages, setPages] = useState();
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    const settings = window.ipcRenderer.sendSync("getAllSettings");
    console.log(settings); // eslint-disable-line
    setPages(settings.pages);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        activePage,
        pages,
        setActivePage: (event: Event, value: string) => {
          setActivePage(value);
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
