import { reaction } from 'mobx';

import getContrastSensitiveStyle from '../getContrastSensitiveStyle';

import style from '../ItkVtkViewer.module.css';

import hiddenIcon from '../icons/hidden.svg';
import wireframeIcon from '../icons/resource-wireframe.svg';
import surfaceIcon from '../icons/resource-surface.svg';
import surfaceWithEdgesIcon from '../icons/resource-surface-with-edges.svg';

function createResourceRepresentationSelector(
  store,
  resourceRepresentationRow
) {
  const viewerDOMId = store.id;

  const contrastSensitiveStyle = getContrastSensitiveStyle(
    ['invertibleButton'],
    store.isBackgroundDark
  );

  const resourceHiddenButton = document.createElement('div');
  resourceHiddenButton.innerHTML = `<input id="${viewerDOMId}-resourceHiddenButton" type="checkbox" class="${
    style.toggleInput
  }"><label itk-vtk-tooltip itk-vtk-tooltip-top itk-vtk-tooltip-content="Hidden" class="${
    contrastSensitiveStyle.tooltipButton
  } ${style.fullscreenButton} ${
    style.toggleButton
  }" for="${viewerDOMId}-resourceHiddenButton">${hiddenIcon}</label>`;
  resourceHiddenButton.addEventListener('click',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      store.resourceUI.representations[selectedResourceIndex] = 'Hidden';
    }
  )
  resourceRepresentationRow.appendChild(resourceHiddenButton);
  const resourceHiddenButtonInput = resourceHiddenButton.children[0];

  const resourceWireframeButton = document.createElement('div');
  resourceWireframeButton.innerHTML = `<input id="${viewerDOMId}-resourceWireframeButton" type="checkbox" class="${
    style.toggleInput
  }"><label itk-vtk-tooltip itk-vtk-tooltip-top itk-vtk-tooltip-content="Wireframe" class="${
    contrastSensitiveStyle.tooltipButton
  } ${style.fullscreenButton} ${
    style.toggleButton
  }" for="${viewerDOMId}-resourceWireframeButton">${wireframeIcon}</label>`;
  resourceWireframeButton.addEventListener('click',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      store.resourceUI.representations[selectedResourceIndex] = 'Wireframe';
    }
  )
  resourceRepresentationRow.appendChild(resourceWireframeButton);
  const resourceWireframeButtonInput = resourceWireframeButton.children[0];

  const resourceSurfaceButton = document.createElement('div');
  resourceSurfaceButton.innerHTML = `<input id="${viewerDOMId}-resourceSurfaceButton" type="checkbox" class="${
    style.toggleInput
  }"><label itk-vtk-tooltip itk-vtk-tooltip-top itk-vtk-tooltip-content="Surface" class="${
    contrastSensitiveStyle.tooltipButton
  } ${style.fullscreenButton} ${
    style.toggleButton
  }" for="${viewerDOMId}-resourceSurfaceButton">${surfaceIcon}</label>`;
  resourceSurfaceButton.addEventListener('click',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      store.resourceUI.representations[selectedResourceIndex] = 'Surface';
    }
  )
  resourceRepresentationRow.appendChild(resourceSurfaceButton);
  const resourceSurfaceButtonInput = resourceSurfaceButton.children[0];

  const resourceSurfaceWithEdgesButton = document.createElement('div');
  resourceSurfaceWithEdgesButton.innerHTML = `<input id="${viewerDOMId}-resourceSurfaceWithEdgesButton" type="checkbox" class="${
    style.toggleInput
  }"><label itk-vtk-tooltip itk-vtk-tooltip-top itk-vtk-tooltip-content="Surface with edges" class="${
    contrastSensitiveStyle.tooltipButton
  } ${style.viewModeButton} ${
    style.toggleButton
  }" for="${viewerDOMId}-resourceSurfaceWithEdgesButton">${surfaceWithEdgesIcon}</label>`;
  resourceSurfaceWithEdgesButton.addEventListener('click',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      store.resourceUI.representations[selectedResourceIndex] = 'Surface with edges';
    }
  )
  resourceRepresentationRow.appendChild(resourceSurfaceWithEdgesButton);
  const resourceSurfaceWithEdgesButtonInput = resourceSurfaceWithEdgesButton.children[0];

  function updateEnabledRepresentationButtons(selectedResourceRepresentation) {
      switch(selectedResourceRepresentation) {
      case 'Hidden':
        resourceHiddenButtonInput.checked = true;
        resourceWireframeButtonInput.checked = false;
        resourceSurfaceButtonInput.checked = false;
        resourceSurfaceWithEdgesButtonInput.checked = false;
        break;
      case 'Wireframe':
        resourceHiddenButtonInput.checked = false;
        resourceWireframeButtonInput.checked = true;
        resourceSurfaceButtonInput.checked = false;
        resourceSurfaceWithEdgesButtonInput.checked = false;
        break;
      case 'Surface':
        resourceHiddenButtonInput.checked = false;
        resourceWireframeButtonInput.checked = false;
        resourceSurfaceButtonInput.checked = true;
        resourceSurfaceWithEdgesButtonInput.checked = false;
        break;
      case 'Surface with edges':
        resourceHiddenButtonInput.checked = false;
        resourceWireframeButtonInput.checked = false;
        resourceSurfaceButtonInput.checked = false;
        resourceSurfaceWithEdgesButtonInput.checked = true;
        break;
      default:
        console.error('Invalid resource representation: ' + selectedResourceRepresentation);
      }
  }

  function setRepresentation(value, index) {
    if(value === 'Hidden') {
      store.resourceUI.representationProxies[index].setVisibility(false)
    } else {
      store.resourceUI.representationProxies[index].setRepresentation(value)
      store.resourceUI.representationProxies[index].setVisibility(true)
    }
    updateEnabledRepresentationButtons(value);
    store.renderWindow.render()
  }

  reaction(() => {
    return store.resourceUI.representations.slice();
  },
    (representations) => {
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      const representation = store.resourceUI.representations[selectedResourceIndex];
      setRepresentation(representation, selectedResourceIndex);
      store.renderWindow.render()
    }
  )

  reaction(() => { return store.resourceUI.selectedResourceIndex; },
    (selectedIndex) => {
      const selectedResourceRepresentation = store.resourceUI.representations[selectedIndex];
      updateEnabledRepresentationButtons(selectedResourceRepresentation);
    }
  )

  const defaultResourceRepresentation = 'Surface';

  reaction(() => {
    return store.resourceUI.resource.slice();
  },
    (resource) => {
      if(!!!resource || resource.length === 0) {
        return;
      }

      resource.forEach((resource, index) => {
        if (store.resourceUI.representations.length <= index) {
          store.resourceUI.representations.push(defaultResourceRepresentation);
        }
      })
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      updateEnabledRepresentationButtons(store.resourceUI.representations[selectedResourceIndex]);
    }
  )

  const defaultResourceRepresentations = new Array(store.resourceUI.resource.length);
  defaultResourceRepresentations.fill(defaultResourceRepresentation);
  updateEnabledRepresentationButtons(defaultResourceRepresentation);
  store.resourceUI.representations = defaultResourceRepresentations;
}

export default createResourceRepresentationSelector;
