import { reaction } from 'mobx';

import getContrastSensitiveStyle from '../getContrastSensitiveStyle';

import style from '../ItkVtkViewer.module.css';

import opacityIcon from '../icons/opacity.svg';

function createResourceOpacitySlider(
  store,
  resourceColorRow
) {
  const contrastSensitiveStyle = getContrastSensitiveStyle(
    ['invertibleButton'],
    store.isBackgroundDark
  );

  const defaultResourceOpacity = 1.0;

  const sliderEntry = document.createElement('div');
  sliderEntry.setAttribute('class', style.sliderEntry);
  sliderEntry.innerHTML = `
    <div itk-vtk-tooltip itk-vtk-tooltip-bottom itk-vtk-tooltip-content="Opacity" class="${
      contrastSensitiveStyle.invertibleButton
    } ${style.gradientOpacitySlider}">
      ${opacityIcon}
    </div>
    <input type="range" min="0" max="1" value="${defaultResourceOpacity}" step="0.01"
      id="${store.id}-resourceOpacitySlider"
      class="${style.slider}" />`;
  const opacityElement = sliderEntry.querySelector(
    `#${store.id}-resourceOpacitySlider`
  );

  reaction(() => {
    return store.resourceUI.resource.slice();
  },
    (resource) => {
      if(!!!resource || resource.length === 0) {
        return;
      }


      resource.forEach((resource, index) => {
        if (store.resourceUI.opacities.length <= index) {
          store.resourceUI.opacities.push(defaultResourceOpacity);
        }
      })
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      opacityElement.value = store.resourceUI.opacities[selectedResourceIndex];
    }
  )

  reaction(() => {
    return store.resourceUI.selectedResourceIndex;
    },
    (selectedResourceIndex) => {
      opacityElement.value = store.resourceUI.opacities[selectedResourceIndex];
    });

  reaction(() => {
    return store.resourceUI.opacities.slice();
  },
    (opacities) => {
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      const value = opacities[selectedResourceIndex];
      store.resourceUI.representationProxies[selectedResourceIndex].setOpacity(value)
      store.renderWindow.render();
      opacityElement.value = value;
    });


  opacityElement.addEventListener('input', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      store.resourceUI.opacities[selectedResourceIndex] = Number(event.target.value);
    });

  const defaultResourceOpacities = new Array(store.resourceUI.resource.length);
  defaultResourceOpacities.fill(defaultResourceOpacity);
  opacityElement.value = defaultResourceOpacity;
  store.resourceUI.opacities = defaultResourceOpacities;

  resourceColorRow.appendChild(sliderEntry);
}

export default createResourceOpacitySlider;
