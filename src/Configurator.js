import React, { useEffect } from 'react';
import { useState, useCallback, useRef, useMemo } from 'react';

import TabbedView from './TabbedView';

import './Configurator.css';

const makeEmbedCode = (url, title, height) => {
  return `<iframe title="${title}" aria-label="Tab-Übersicht: ${title}" src="${url}" scrolling="no" frameborder="0" width="94%" style="margin: 0 3%; border: none;" height="${height || 400}"></iframe>`
}


function Configurator() {
  const [tabs, setTabs] = useState([]);
  const [addAllowed, setAddAllowed] = useState(false);
  const [embedTitle, setEmbedTitle] = useState('');
  const [embedHeight, setEmbedHeight] = useState(null);

  const titleRef = useRef();
  const urlRef = useRef();
  const viewRef = useRef();

  const embedTitleRef = useRef();
  const embedHeightRef = useRef();
  const embedRef = useRef();

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

  const editTabTitleCallback = useCallback(
    (tab) => setTabs(
      tabs.map(
        (t) => t !== tab ? t : { ...tab, title: window.prompt("Neuen Titel eingeben:", tab.title) || tab.title }
      )
    ),
    [tabs]
  )
  const editTabUrlCallback = useCallback(
    (tab) => setTabs(
      tabs.map(
        (t) => t !== tab ? t : { ...tab, url: window.prompt("Neue URL eingeben:", tab.url) || tab.url }
      )
    ),
    [tabs]
  )
  const removeTabCallback = useCallback(
    (tab) => setTabs(
      tabs.filter((t) => t !== tab)
    ),
    [tabs]
  )

  const copyViewUrlCallback = useCallback(() => {
    viewRef.current.select();
    document.execCommand("copy");
  }, [])

  const copyEmbedCodeCallback = useCallback(() => {
    embedRef.current.select();
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

  const embedCode = useMemo(
    () => makeEmbedCode(viewUrl, embedTitle, embedHeight),
    [viewUrl, embedTitle, embedHeight]
  )
  useEffect(
    () => {
      embedRef.current.value = embedCode;
    },
    [embedCode]);

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
            <div key={i} className="new_config_tab-item">
              <span>{tab.title}</span>
              <button onClick={() => editTabTitleCallback(tab)}>✏</button>
              <a href={tab.url} target="_blank" rel="noopener noreferrer">{tab.url}</a>
              <button onClick={() => editTabUrlCallback(tab)}>✏</button>
              <button onClick={() => removeTabCallback(tab)}>❌</button>
            </div>
          )}
          <div className="new_config_tab-url">
            <h3 className="break">Direkte URL</h3>
            <input type="url" readOnly ref={viewRef} className="new_config_tab-url-field" value={viewUrl} />
            <button onClick={copyViewUrlCallback} title="Kopieren"><span role="img" aria-label="Kopieren">📝</span></button>
          </div>
          <div className="new_config_tab-embed">
            <h3 className="break">Embed-Code</h3>
            <input ref={embedTitleRef} onChange={(ev) => setEmbedTitle(ev.currentTarget.value)} type="text" aria-label="Titel" placeholder="Titel (für Barrierefreiheit etc.)" />
            <div className="break" />
            <input ref={embedHeightRef} onChange={(ev) => setEmbedHeight(ev.currentTarget.valueAsNumber)} type="number" aria-label="Höhe (pixel)" placeholder="Höhe (pixel)" />
            <div className="break" />
            <textarea ref={embedRef} className="new_config_tab-embed-area"></textarea>
            <button onClick={copyEmbedCodeCallback} title="Kopieren"><span role="img" aria-label="Kopieren">📝</span></button>
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
