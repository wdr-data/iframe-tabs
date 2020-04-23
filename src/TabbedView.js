import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import './TabbedView.css';

function Frame({ title, url }) {
  return <iframe className="frame" src={url} title={title} />
}

function TabbedView({ tabs }) {
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
            tabs.map((tab, i) => <TabPanel key={i} className="panel" aria-expanded={i === currentTab}><Frame title={tab.title} url={tab.url} /></TabPanel>)
          }
        </div>
      </Tabs>
    </div>
  );
}

export default TabbedView;
