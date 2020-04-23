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
      <Tabs className="tabs">
        <TabList>
          {
            tabs.map((tab, i) => <Tab key={i}>{tab.title}</Tab>)
          }
        </TabList>

        {
          tabs.map((tab, i) => <TabPanel key={i} className="panel"><Frame title={tab.title} url={tab.url} /></TabPanel>)
        }
      </Tabs>
    </div>
  );
}

export default TabbedView;
