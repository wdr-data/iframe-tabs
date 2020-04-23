import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './index.css';
import TabbedView from './TabbedView';
import Configurator from './Configurator';

const urlParams = new URLSearchParams(window.location.search);

const titles = urlParams.getAll('title');
const frames = urlParams.getAll('frame');

const tabs = titles.map((title, i) => ({ title, url: frames[i] }));

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/view">
          <TabbedView tabs={tabs} />
        </Route>
        <Route path="/new">
          <Configurator />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
