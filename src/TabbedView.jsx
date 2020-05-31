import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import classNames from "classnames";
import DWChart from "react-datawrapper-chart";

import "react-tabs/style/react-tabs.css";
import "./react-tabs-style-overrides.css";

import "./TabbedView.css";
import { useLayoutEffect } from "react";
import { useRef } from "react";

const Frame = ({ tab, ...props }) => {
  return <DWChart src={tab.url} title={tab.frameTitle} aria-label={tab.ariaLabel} {...props} />;
};

function TabbedView({ uuid, tabs, height = "", background = "#fdfdfc" }) {
  const [currentTab, setCurrentTab] = useState(0);
  const appRef = useRef();

  useLayoutEffect(() => {
    if (!uuid) {
      return;
    }

    const handle = setInterval(async () => {
      if (!appRef.current) return;
      if (height) return;
      const app = appRef.current;
      const command = {
        "set-height": {
          value: `${app.clientHeight}`,
        },
      };
      window.parent.postMessage({ "data-tabs-command": command, "data-tabs-target": uuid }, "*");
    }, 1000);
    return () => {
      clearInterval(handle);
    };
  }, [height, uuid]);

  return (
    <div className="app" ref={appRef} style={{ background }}>
      <Tabs
        className="tabs"
        style={{ height: `${height}px` }}
        forceRenderTabPanel
        onSelect={(index) => setCurrentTab(index)}
      >
        <TabList>
          {tabs.map((tab, i) => (
            <Tab key={i}>{tab.title}</Tab>
          ))}
        </TabList>

        <div className={classNames("panel-container", height && "panel-fixed")}>
          {tabs.map((tab, i) => (
            <TabPanel
              key={i}
              className={classNames(
                "panel",
                i !== currentTab ? "panel-out" : "panel-selected",
                height && "panel-fixed"
              )}
              style={{ background }}
              aria-expanded={i === currentTab}
            >
              <Frame tab={tab} className={classNames("frame", height && "frame-fixed")} />
            </TabPanel>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

export default TabbedView;
