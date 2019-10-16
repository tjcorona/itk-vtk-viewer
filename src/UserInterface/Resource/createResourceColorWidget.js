import style from '../ItkVtkViewer.module.css';

import createResourceColorChooser from './createResourceColorChooser';
import createResourceOpacitySlider from './createResourceOpacitySlider';
import createResourceColorPresetSelector from './createResourceColorPresetSelector';
import createResourceColorBySelector from './createResourceColorBySelector';
import createResourceColorRangeInput from './createResourceColorRangeInput';

function createResourceColorWidget(
  store,
  resourceUIGroup
) {
  const colorByRow = document.createElement('div')
  colorByRow.setAttribute('class', style.uiRow)
  colorByRow.className += ` ${store.id}-toggle`;
  createResourceColorBySelector(
    store,
    colorByRow
  )
  resourceUIGroup.appendChild(colorByRow)

  const resourceColorRow = document.createElement('div')
  resourceColorRow.setAttribute('class', style.uiRow)
  resourceColorRow.className += ` ${store.id}-toggle`;

  createResourceColorChooser(
    store,
    resourceColorRow
  )

  createResourceOpacitySlider(
    store,
    resourceColorRow
  )
  resourceUIGroup.appendChild(resourceColorRow)

  const resourceColorPresetRow = document.createElement('div')
  resourceColorPresetRow.setAttribute('class', style.uiRow)
  resourceColorPresetRow.className += ` ${store.id}-toggle`;
  createResourceColorPresetSelector(
    store,
    resourceColorPresetRow
  )
  resourceUIGroup.appendChild(resourceColorPresetRow)

  const colorRangeInputRow = document.createElement('div');
  colorRangeInputRow.setAttribute('class', style.uiRow);
  createResourceColorRangeInput(
    store,
    colorRangeInputRow
  );
  colorRangeInputRow.className += ` ${store.id}-toggle`;
  resourceUIGroup.appendChild(colorRangeInputRow);
}

export default createResourceColorWidget;
