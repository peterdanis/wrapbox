import React, { createContext, useState } from "react";
import { Page } from "../wrapbox"; // eslint-disable-line import/no-unresolved
import { v4 as uuid } from "uuid";

type AddPage = (url: Page["url"], icon: Page["icon"]) => void;

type SetActivePage = (event: React.ChangeEvent<{}>, value: string) => void;

interface Props {
  children?: React.ReactNode;
}

interface State {
  activePage: string;
  addPage?: AddPage;
  pages: Page[];
  setActivePage?: SetActivePage;
}

const initialState: State = (() => {
  const { pages } = window.ipcRenderer.sendSync("getAllSettings");
  return {
    activePage: pages[0] ? pages[0].id : "",
    pages,
  };
})();

export const GlobalContext = createContext(initialState);

export const GlobalState: React.FunctionComponent = (props: Props) => {
  const { children } = props;
  const [pages, setPages] = useState(initialState.pages);
  const [activePage, setActivePage] = useState(initialState.activePage);

  const addPage: AddPage = (url, icon) => {
    const newPages = [
      ...pages,
      {
        icon,
        id: uuid(),
        url,
      },
    ];
    window.ipcRenderer.send("setSettings", { pages: newPages });
    setPages(newPages);
  };

  return (
    <GlobalContext.Provider
      value={{
        activePage,
        addPage,
        pages,
        setActivePage(event, value) {
          setActivePage(value);
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
