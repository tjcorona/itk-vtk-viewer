import { reaction } from 'mobx';

import style from '../ItkVtkViewer.module.css';

import {
  ColorMode,
  ScalarMode,
} from 'vtk.js/Sources/Rendering/Core/Mapper/Constants';

function createResourceColorBySelector(
  store,
  colorByRow
) {
  const colorBySelector = document.createElement('select');
  colorBySelector.setAttribute('class', style.selector);
  colorBySelector.id = `${store.id}-colorBySelector`;

  reaction(() => {
    return store.resourceUI.resource['components'].concat(store.resourceUI.resource['instances']);
  },
    (resource) => {
      if(!!!resource || resource.length === 0) {
        return;
      }

      const hasScalars = store.resourceUI.hasScalars;
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      const colorByOptions = store.resourceUI.colorByOptions;

      if (store.resourceUI.hasScalars[selectedResourceIndex] && colorByOptions[selectedResourceIndex].length > 1) {
        colorByRow.style.display = 'flex';
      } else {
        colorByRow.style.display = 'none';
      }

      const colorByDefault = store.resourceUI.colorByDefault;
      resource.forEach((resource, index) => {
        if (store.resourceUI.colorBy.length <= index) {
          store.resourceUI.colorBy.push(colorByDefault[index]);
        } else {
          const current = store.resourceUI.colorBy[index];
          if(!!store.resourceUI.colorByOptions[index] && !!!store.resourceUI.colorByOptions[index].filter((option) => { return option.label === current.label && option.value === current.value; }).length) {
            store.resourceUI.colorBy[index] = colorByDefault[index];
          }
        }
      })

      if (hasScalars[selectedResourceIndex]) {
        colorBySelector.value = store.resourceUI.colorBy[selectedResourceIndex].value;
      }
    }
  )

  reaction(() => {
    return store.resourceUI.selectedResourceIndex;
    },
    (selectedResourceIndex) => {
      const colorByOptions = store.resourceUI.colorByOptions;

      if (!!colorByOptions[selectedResourceIndex] && !!colorByOptions[selectedResourceIndex].length) {
        colorBySelector.innerHTML = colorByOptions[selectedResourceIndex]
          .map(
            ({ label, value }) =>
              `<option value="${value}" >${label}</option>`
          )
          .join('');
        colorBySelector.value = store.resourceUI.colorBy[selectedResourceIndex].value;
      }
      const hasScalars = store.resourceUI.hasScalars;
      if (hasScalars[selectedResourceIndex] && colorByOptions[selectedResourceIndex].length > 1) {
        colorByRow.style.display = 'flex';
      } else {
        colorByRow.style.display = 'none';
      }
    });

  reaction(() => {
    return store.resourceUI.colorBy.slice();
  },
    (colorBy) => {
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      if (!!!colorBy[selectedResourceIndex]) {
        return;
      }
      const [location, colorByArrayName] = colorBy[selectedResourceIndex].value.split(':');
      const proxy = store.resourceUI.representationProxies[selectedResourceIndex];
      const interpolateScalarsBeforeMapping = location === 'pointData';
      proxy.setInterpolateScalarsBeforeMapping(interpolateScalarsBeforeMapping);
      proxy.setColorBy(colorByArrayName, location);
      store.renderWindow.render()

      const hasScalars = store.resourceUI.hasScalars;
      if (hasScalars[selectedResourceIndex]) {
        colorBySelector.value = store.resourceUI.colorBy[selectedResourceIndex].value;
      }
    });

  colorBySelector.addEventListener('change', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
    const colorByOptions = store.resourceUI.colorByOptions;
    const selectedOption = store.resourceUI.colorByOptions[selectedResourceIndex].filter((option) => { return option.value === event.target.value; })[0]
    store.resourceUI.colorBy[selectedResourceIndex] = selectedOption;
  });

  // Initialize coloring
  const colorByDefault = store.resourceUI.colorByDefault;
  colorByDefault.forEach((colorBy, index) => {
    if (colorBy) {
      const [location, colorByArrayName] = colorBy.value.split(':');
      const proxy = store.resourceUI.representationProxies[index];
      const interpolateScalarsBeforeMapping = location === 'pointData';
      proxy.setInterpolateScalarsBeforeMapping(interpolateScalarsBeforeMapping);
      proxy.setColorBy(colorByArrayName, location);
    }
  })
  const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
  const colorByOptions = store.resourceUI.colorByOptions;
  if (colorByDefault[selectedResourceIndex]) {
    colorBySelector.innerHTML = colorByOptions[selectedResourceIndex]
      .map(
        ({ label, value }) =>
          `<option value="${value}" >${label}</option>`
      )
      .join('');
    colorBySelector.value = colorByDefault[selectedResourceIndex].value;
  }
  if (store.resourceUI.hasScalars[selectedResourceIndex] && colorByOptions[selectedResourceIndex].length > 1) {
    colorByRow.style.display = 'flex';
  } else {
    colorByRow.style.display = 'none';
  }
  store.resourceUI.colorBy = colorByDefault;

  colorByRow.appendChild(colorBySelector);
}

export default createResourceColorBySelector;
