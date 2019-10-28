import { reaction } from 'mobx';

import style from '../ItkVtkViewer.module.css';

import ColorPresetNames from '../ColorPresetNames';

function createResourceColorPresetSelector(
  store,
  resourceColorPresetRow
) {
  const presetSelector = document.createElement('select');
  presetSelector.setAttribute('class', style.selector);
  presetSelector.id = `${store.id}-resourceColorMapSelector`;
  presetSelector.innerHTML = ColorPresetNames
    .map((name) => `<option value="${name}">${name}</option>`)
    .join('');

  const defaultResourceColorPreset = 'Viridis (matplotlib)';

  reaction(() => {
    return store.resourceUI.resource['components'].concat(store.resourceUI.resource['instances']);
  },
    (resource) => {
      if(!!!resource || resource.length === 0) {
        return;
      }

      const hasScalars = store.resourceUI.hasScalars;
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;

      if (store.resourceUI.hasScalars[selectedResourceIndex]) {
        resourceColorPresetRow.style.display = 'flex';
      } else {
        resourceColorPresetRow.style.display = 'none';
      }

      resource.forEach((resource, index) => {
        if (store.resourceUI.colorPresets.length <= index) {
          store.resourceUI.colorPresets.push(defaultResourceColorPreset);
        }
      })

      if (hasScalars[selectedResourceIndex]) {
        presetSelector.value = store.resourceUI.colorPresets[selectedResourceIndex];
      }
    }
  )

  reaction(() => {
    return store.resourceUI.selectedResourceIndex;
    },
    (selectedResourceIndex) => {
      presetSelector.value = store.resourceUI.colorPresets[selectedResourceIndex]
      const hasScalars = store.resourceUI.hasScalars;
      if (hasScalars[selectedResourceIndex]) {
        resourceColorPresetRow.style.display = 'flex';
      } else {
        resourceColorPresetRow.style.display = 'none';
      }
    });

  reaction(() => {
    return store.resourceUI.colorPresets.slice();
  },
    (colorPresets) => {
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      const value = colorPresets[selectedResourceIndex];
      presetSelector.value = value;
      const proxy = store.resourceUI.representationProxies[selectedResourceIndex];
      const [colorByArrayName, location] = proxy.getColorBy();
      const lutProxy = proxy.getLookupTableProxy(colorByArrayName, location);
      if (lutProxy) {
        lutProxy.setPresetName(value);
      }
      store.renderWindow.render();
    });

  presetSelector.addEventListener('change', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      store.resourceUI.colorPresets[selectedResourceIndex] = event.target.value;
    });

  const hasScalars = store.resourceUI.hasScalars;
  const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
  if (hasScalars[selectedResourceIndex]) {
    resourceColorPresetRow.style.display = 'flex';
  } else {
    resourceColorPresetRow.style.display = 'none';
  }
  const defaultResourceColorPresets = new Array(store.resourceUI.resource['components'].length + store.resourceUI.resource['instances'].length);
  defaultResourceColorPresets.fill(defaultResourceColorPreset);
  presetSelector.value = defaultResourceColorPreset;
  store.resourceUI.colorPresets = defaultResourceColorPresets;
  const representationProxies = store.resourceUI.representationProxies;
  representationProxies.forEach((proxy) => {
    const colorByArrayName = proxy.getColorBy();
    const lutProxy = proxy.getLookupTableProxy(colorByArrayName);
    if (lutProxy) {
      lutProxy.setPresetName(defaultResourceColorPreset);
    }
  })

  resourceColorPresetRow.appendChild(presetSelector);
}

export default createResourceColorPresetSelector;
