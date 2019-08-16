import style from '../ItkVtkViewer.module.css';

import annotationIcon from '../icons/annotations.svg';

function createAnnotationButton(
  viewerStore,
  contrastSensitiveStyle,
  mainUIRow
) {
  const annotationButton = document.createElement('div');
  annotationButton.innerHTML = `<input id="${viewerStore.id}-toggleAnnotationsButton" type="checkbox" class="${
    style.toggleInput
  }" checked><label itk-vtk-tooltip itk-vtk-tooltip-top-annotation itk-vtk-tooltip-content="Annotations" class="${
    contrastSensitiveStyle.invertibleButton
  } ${style.annotationButton} ${
    style.toggleButton
  }" for="${viewerStore.id}-toggleAnnotationsButton">${annotationIcon}</label>`;
  const annotationButtonInput = annotationButton.children[0];
  function toggleAnnotations() {
    const annotationEnabled = annotationButtonInput.checked;
    viewerStore.itkVtkView.setOrientationAnnotationVisibility(annotationEnabled);
  }
  annotationButton.addEventListener('change', (event) => {
    toggleAnnotations();
  });
  mainUIRow.appendChild(annotationButton);
}

export default createAnnotationButton;
