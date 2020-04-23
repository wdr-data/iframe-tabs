import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import './TabbedView.css';

function Frame({ title, url }) {
  return <iframe className="frame" src={url} title={title} />
}

function TabbedView({ tabs }) {
  return (
    <div className="app">
      <Tabs className="tabs" forceRenderTabPanel>
        <TabList>
          {
            tabs.map((tab, i) => <Tab key={i}>{tab.title}</Tab>)
          }
        </TabList>

        <div className="panel-container">
          {
            tabs.map((tab, i) => <TabPanel key={i} className="panel"><Frame title={tab.title} url={tab.url} /></TabPanel>)
          }
        </div>
      </Tabs>
    </div>
  );
}

export default TabbedView;
