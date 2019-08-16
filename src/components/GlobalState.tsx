import React, { createContext, useState } from "react";
import { Page } from "../wrapbox"; // eslint-disable-line import/no-unresolved

interface Props {
  children?: React.ReactNode;
}

interface State {
  activePage: string;
  pages: Page[];
  setActivePage?(event: React.ChangeEvent<{}>, value: string): void;
}

const initialState: State = (() => {
  const { pages } = window.ipcRenderer.sendSync("getAllSettings");
  return {
    activePage: pages[0].id,
    pages,
  };
})();

export const GlobalContext = createContext(initialState);

export const GlobalState: React.FunctionComponent = (props: Props) => {
  const { children } = props;
  const [pages, setPages] = useState(initialState.pages);
  const [activePage, setActivePage] = useState(initialState.activePage);

  return (
    <GlobalContext.Provider
      value={{
        activePage,
        pages,
        setActivePage: (event, value) => {
          setActivePage(value);
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
