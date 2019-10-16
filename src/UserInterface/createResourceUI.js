import { reaction, autorun } from 'mobx';

import style from './ItkVtkViewer.module.css';

import createResourceRepresentationSelector from './Resource/createResourceRepresentationSelector';
import createResourceColorWidget from './Resource/createResourceColorWidget';

function createResourceUI(
  store,
) {
  const resourceUIGroup = document.createElement('div');
  resourceUIGroup.setAttribute('class', style.uiGroup);

  const resourceRepresentationRow = document.createElement('div');
  resourceRepresentationRow.setAttribute('class', style.uiRow);
  resourceRepresentationRow.className += ` ${store.id}-toggle`;

  const resourceSelector = document.createElement('select');
  resourceSelector.setAttribute('class', style.selector);
  resourceSelector.id = `${store.id}-resourceSelector`;
  resourceRepresentationRow.appendChild(resourceSelector);

  resourceSelector.addEventListener('change', (event) => {
    event.preventDefault();
    event.stopPropagation();
    store.resourceUI.selectedResourceIndex = resourceSelector.selectedIndex;
  })
  function updateResourceNames(names) {
    resourceSelector.innerHTML = names
      .map((name) => `<option value="${name}">${name}</option>`)
      .join('');
    if(names.length > 1) {
      resourceSelector.disabled = false;
    } else {
      resourceSelector.disabled = true;
    }
  }
  reaction(() => { return store.resourceUI.names.slice(); },
    (names) => { updateResourceNames(names); }
  )
  if(store.resourceUI.resource.length > 0) {
    store.resourceUI.selectedResourceIndex = 0;
  }
  autorun(() => {
      const resource = store.resourceUI.resource;
      if (resource.length === 1) {
        store.resourceUI.names = ['Component'];
      } else {
        store.resourceUI.names = resource.map((component, index) => `Component ${index}`);
      }
    })

  createResourceRepresentationSelector(
    store,
    resourceRepresentationRow
  )
  resourceUIGroup.appendChild(resourceRepresentationRow);

  createResourceColorWidget(
    store,
    resourceUIGroup
  )

  store.mainUI.uiContainer.appendChild(resourceUIGroup);
  store.resourceUI.initialized = true;
}

export default createResourceUI;
