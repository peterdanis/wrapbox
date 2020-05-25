import React, { createContext, useEffect, useState } from "react";
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

const blankState: State = {
  activePage: "",
  pages: [],
};

export const GlobalContext = createContext(blankState);

export const GlobalState: React.FunctionComponent = (props: Props) => {
  const { children } = props;
  const [pages, setPages] = useState(blankState.pages);
  const [activePage, setActivePage] = useState(blankState.activePage);

  useEffect(() => {
    (async () => {
      const { pages: loadedPages } = await window.ipcRenderer.invoke(
        "getAllSettings",
      );
      setPages(loadedPages);
      setActivePage(loadedPages[0].id);
    })();
  }, []);

  const addPage: AddPage = async (url, icon) => {
    const newPages = [
      ...pages,
      {
        icon,
        id: uuid(),
        url,
      },
    ];
    await window.ipcRenderer.invoke("setSettings", { pages: newPages });
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
