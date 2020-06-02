import React, { useState, useMemo } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import classNames from "classnames";
import DWChart from "react-datawrapper-chart";

import "react-tabs/style/react-tabs.css";
import "./react-tabs-style-overrides.css";

import "./TabbedView.css";
import { useLayoutEffect } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const Frame = ({ tab, isFixedHeight, ...props }) => {
  if (isFixedHeight) {
    return <iframe src={tab.url} title={tab.frameTitle} aria-label={tab.ariaLabel} {...props} />;
  } else {
    return <DWChart src={tab.url} title={tab.frameTitle} aria-label={tab.ariaLabel} {...props} />;
  }
};

function TabbedView({ uuid, tabs, height = "", background = "#fdfdfc" }) {
  const [currentTab, setCurrentTab] = useState(0);
  const [appHeight, setAppHeight] = useState();
  const appRef = useRef();

  const isFixedHeight = useMemo(() => height || height === null, [height]);

  useLayoutEffect(() => {
    if (!uuid || isFixedHeight) {
      return;
    }

    const handle = setInterval(async () => {
      if (!appRef.current) return;
      const app = appRef.current;
      setAppHeight(app.clientHeight);
    }, 100);
    return () => {
      clearInterval(handle);
    };
  }, [isFixedHeight, uuid]);

  useEffect(() => {
    if (!appHeight || !uuid) return;

    const command = {
      "set-height": {
        value: `${appHeight}`,
      },
    };
    window.parent.postMessage({ "data-tabs-command": command, "data-tabs-target": uuid }, "*");
  }, [uuid, appHeight]);

  return (
    <div
      className={classNames("app", isFixedHeight && "app-fixed")}
      ref={appRef}
      style={{ background }}
    >
      <Tabs
        className={classNames("tabs", isFixedHeight && "tabs-fixed")}
        forceRenderTabPanel
        onSelect={(index) => setCurrentTab(index)}
      >
        <TabList>
          {tabs.map((tab, i) => (
            <Tab key={i}>{tab.title}</Tab>
          ))}
        </TabList>

        <div className={classNames("panel-container", isFixedHeight && "panel-fixed")}>
          {tabs.map((tab, i) => (
            <TabPanel
              key={i}
              className={classNames(
                "panel",
                i !== currentTab ? "panel-out" : "panel-selected",
                isFixedHeight && "panel-fixed"
              )}
              style={{ background }}
              aria-expanded={i === currentTab}
            >
              <Frame
                tab={tab}
                isFixedHeight={isFixedHeight}
                className={classNames("frame", isFixedHeight && "frame-fixed")}
              />
            </TabPanel>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

export default TabbedView;
