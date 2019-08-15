import React, {
  ChangeEvent,
  createContext,
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Page } from "../wrapbox"; // eslint-disable-line import/no-unresolved

interface Props {
  children?: ReactNode;
}

interface State {
  activePage: string;
  pages: Page[];
  setActivePage(event: ChangeEvent<{}>, value: string): void;
}

const initialState: State = (() => {
  const { pages } = window.ipcRenderer.sendSync("getAllSettings");
  return {
    activePage: pages[0].id,
    pages,
    setActivePage() {
      //
    },
  };
})();

export const GlobalContext = createContext(initialState);

export const GlobalState: FunctionComponent = (props: Props) => {
  const { children } = props;
  const [pages, setPages] = useState();
  const [activePage, setActivePage] = useState();

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
        setActivePage: (event, value) => {
          setActivePage(value);
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
