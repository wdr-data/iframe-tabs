import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames';

import 'react-tabs/style/react-tabs.css';

import './TabbedView.css';

function Frame({ tab }) {
  return <iframe className="frame" src={tab.url} title={tab.frameTitle} aria-label={tab.ariaLabel} frameBorder="0" scrolling="no" />
}

function TabbedView({ tabs, background = '#fdfdfc' }) {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div className="app">
      <Tabs className="tabs" forceRenderTabPanel onSelect={(index) => setCurrentTab(index)}>
        <TabList>
          {
            tabs.map((tab, i) => <Tab key={i}>{tab.title}</Tab>)
          }
        </TabList>

        <div className="panel-container">
          {
            tabs.map(
              (tab, i) =>
                <TabPanel
                  key={i}
                  className={classNames("panel", i !== currentTab && "panelOut")}
                  style={{background}}
                  aria-expanded={i === currentTab}>
                  <Frame tab={tab} />
                </TabPanel>
            )
          }
        </div>
      </Tabs>
    </div>
  );
}

export default TabbedView;
