import React, { useContext } from "react";
import DynamicIcon from "./DynamicIcon";
import { GlobalContext } from "./GlobalState";
import { Paper } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
// import uuid from "uuid/v4";

// const dummyTabs = [
//   {
//     // icon: "UserArrowRight",
//     id: uuid(),
//   },
//   {
//     icon: "PersonArrowRight",
//     id: uuid(),
//   },
//   {
//     icon: "PersonArrowRight",
//     id: uuid(),
//   },
//   {
//     icon: "PersonArrowRight",
//     id: uuid(),
//   },
//   {
//     icon: "Google",
//     id: uuid(),
//   },
//   {
//     icon: "Account",
//     id: uuid(),
//   },
//   {
//     icon: "Adobe",
//     id: uuid(),
//   },
// ];

export default function TopBar(): React.ReactElement {
  const { activePage, pages, setActivePage } = useContext(GlobalContext);

  return (
    <Paper square>
      <Tabs
        value={activePage}
        onChange={setActivePage}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="on"
      >
        {Array.isArray(pages)
          ? pages.map(page => {
              return (
                <Tab
                  value={page.id}
                  key={page.id}
                  icon={<DynamicIcon iconName={page.icon} />}
                  disableRipple
                />
              );
            })
          : null}
      </Tabs>
    </Paper>
  );
}
