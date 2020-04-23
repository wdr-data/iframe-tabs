import React from 'react';
import { useState, useCallback, useRef, useMemo } from 'react';

import TabbedView from './TabbedView';

import './Configurator.css';


function Configurator() {
  const [tabs, setTabs] = useState([]);
  const [addAllowed, setAddAllowed] = useState(false);

  const titleRef = useRef();
  const urlRef = useRef();
  const viewRef = useRef();

  const newTabCallback = useCallback(() => {
    if (!addAllowed) return;
    setTabs(tabs.concat([{ title: titleRef.current.value, url: urlRef.current.value }]))
    titleRef.current.value = '';
    urlRef.current.value = '';
    setAddAllowed(false);
  }, [tabs, addAllowed])

  const keyCallback = useCallback((ev) => {
    setAddAllowed(titleRef.current.value && urlRef.current.value);
    if (ev.key === "Enter") {
      newTabCallback();
    }
  }, [newTabCallback])

  const copyViewUrlCallback = useCallback(() => {
    viewRef.current.select();
    document.execCommand("copy");
  }, [])

  const viewUrl = useMemo(
    () => {
      const url = new URL('/view', window.location.origin);
      for (const tab of tabs) {
        url.searchParams.append('title', tab.title);
        url.searchParams.append('frame', tab.url);
      }
      return url.toString();
    },
    [tabs]
  );

  return (
    <div className="new">
      <div className="new_config">
        <div className="new_config_new-tab">
          <input type="text" className="new_config_new-tab-title" ref={titleRef} placeholder="Titel" onKeyUp={keyCallback} />
          <input type="url" className="new_config_new-tab-url" ref={urlRef} placeholder="URL" onKeyUp={keyCallback} />
          <button onClick={newTabCallback} disabled={!addAllowed}>Hinzufügen</button>
        </div>
        <div className="new_config_tabs">
          {tabs.map((tab, i) =>
            <div className="new_config_tab-item">
              <span>{tab.title}</span>
              <a href={tab.url} target="_blank" rel="noopener noreferrer">{tab.url}</a>
              <button onClick={() => setTabs(tabs.filter((t) => t !== tab))}>Löschen</button>
            </div>
          )}
          <div className="new_config_tab-url">
            <input type="url" ref={viewRef} className="new_config_tab-url_field" value={viewUrl} />
            <button onClick={copyViewUrlCallback} title="Kopieren"><span role="img" aria-label="Kopieren">🔗</span></button>
          </div>
        </div>
      </div>

      <div className="new_preview">
        <TabbedView tabs={tabs} />
      </div>
    </div>
  );
}

export default Configurator;
