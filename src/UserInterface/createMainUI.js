import getContrastSensitiveStyle from './getContrastSensitiveStyle';

import style from './ItkVtkViewer.module.css';

import createToggleUserInterface from './Main/createToggleUserInterfaceButton';
import createScreenshotButton from './Main/createScreenshotButton';
import createFullscreenButton from './Main/createFullscreenButton';
import createRotateButton from './Main/createRotateButton';
import createAnnotationButton from './Main/createAnnotationButton';
import createInterpolationButton from './Main/createInterpolationButton';
import createViewModeButtons from './Main/createViewModeButtons';
import createCroppingButtons from './Main/createCroppingButtons';
import createResetCameraButton from './Main/createResetCameraButton';

function createMainUI(
  rootContainer,
  viewerStore,
  use2D,
) {
  const uiContainer = document.createElement('div');
  viewerStore.uiContainer = uiContainer;
  rootContainer.appendChild(uiContainer);
  uiContainer.setAttribute('class', style.uiContainer);

  const contrastSensitiveStyle = getContrastSensitiveStyle(
    ['invertibleButton', 'tooltipButton'],
    viewerStore.isBackgroundDark
  );

  const mainUIGroup = document.createElement('div');
  mainUIGroup.setAttribute('class', style.uiGroup);

  const mainUIRow = document.createElement('div');
  mainUIRow.setAttribute('class', style.mainUIRow);
  mainUIRow.className += ` ${viewerStore.id}-toggle`;
  mainUIGroup.appendChild(mainUIRow);

  createToggleUserInterface(
    viewerStore,
    contrastSensitiveStyle,
    uiContainer
  )

  createScreenshotButton(
    viewerStore,
    contrastSensitiveStyle,
    mainUIRow
  )

  createFullscreenButton(
    viewerStore,
    contrastSensitiveStyle,
    rootContainer,
    mainUIRow
  )

  createRotateButton(
    viewerStore,
    contrastSensitiveStyle,
    mainUIRow
  )

  createAnnotationButton(
    viewerStore,
    contrastSensitiveStyle,
    mainUIRow
  )

  createInterpolationButton(
    viewerStore,
    contrastSensitiveStyle,
    mainUIRow
  )

  createViewModeButtons(
    viewerStore,
    contrastSensitiveStyle,
    uiContainer,
    use2D,
    mainUIRow
  )

  createCroppingButtons(
    viewerStore,
    contrastSensitiveStyle,
    mainUIRow
  )

  createResetCameraButton(
    viewerStore,
    contrastSensitiveStyle,
    mainUIRow
  )
  uiContainer.appendChild(mainUIGroup);

  return { uiContainer };
}

export default createMainUI;
