import { reaction } from 'mobx';

import style from '../ItkVtkViewer.module.css';
import hex2rgb from '../hex2rgb';

function createResourceColorChooser(
  store,
  resourceColorRow
) {
  const resourceColorInput = document.createElement('input');
  resourceColorInput.setAttribute('type', 'color');
  resourceColorInput.id = `${store.id}-resourceColorInput`;

  const defaultResourceColor = '#ffffff';

  reaction(() => {
    return store.resourceUI.resource['components'].concat(store.resourceUI.resource['instances']);
  },
    (resource) => {
      if(!!!resource || resource.length === 0) {
        return;
      }

      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;

      resource.forEach((resource, index) => {
        if (store.resourceUI.colors.length <= index) {
          store.resourceUI.colors.push(defaultResourceColor);
        }
      })
      resourceColorInput.value = store.resourceUI.colors[selectedResourceIndex];
    }
  )

  reaction(() => {
    return store.resourceUI.selectedResourceIndex;
    },
    (selectedResourceIndex) => {
      resourceColorInput.value = store.resourceUI.colors[selectedResourceIndex];
      if (store.resourceUI.hasScalars[selectedResourceIndex]) {
        resourceColorInput.style.display = 'none';
      } else {
        resourceColorInput.style.display = 'inline-block';
      }
    });

  reaction(() => {
    return store.resourceUI.colors.slice();
  },
    (colors) => {
      colors.forEach((value, index) => {
        const rgb = hex2rgb(value)
        store.resourceUI.representationProxies[index].setColor(rgb)
      })
      store.renderWindow.render()
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      resourceColorInput.value = colors[selectedResourceIndex];
    });

  resourceColorInput.addEventListener('input',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
      store.resourceUI.colors[selectedResourceIndex] = event.target.value;
    });

  const defaultResourceColors = Array(store.resourceUI.resource['components'].length + store.resourceUI.resource['instances'].length);
  defaultResourceColors.fill(defaultResourceColor);
  resourceColorInput.value = defaultResourceColor;
  store.resourceUI.colors = defaultResourceColors;
  const selectedResourceIndex = store.resourceUI.selectedResourceIndex;
  if (store.resourceUI.hasScalars[selectedResourceIndex]) {
    resourceColorInput.style.display = 'none';
  } else {
    resourceColorInput.style.display = 'inline-block';
  }

  resourceColorRow.appendChild(resourceColorInput);
}

export default createResourceColorChooser;
