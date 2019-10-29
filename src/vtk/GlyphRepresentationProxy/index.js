import macro from 'vtk.js/Sources/macro';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkGlyph3DMapper from 'vtk.js/Sources/Rendering/Core/Glyph3DMapper';

import vtkAbstractRepresentationProxy from 'vtk.js/Sources/Proxy/Core/AbstractRepresentationProxy';

const PROPERTIES_STATE = {
  representation: {
    'Surface with edges': {
      property: { edgeVisibility: true, representation: 2 },
    },
    Surface: { property: { edgeVisibility: false, representation: 2 } },
    Wireframe: { property: { edgeVisibility: false, representation: 1 } },
    Points: { property: { edgeVisibility: false, representation: 0 } },
  },
};

const PROPERTIES_DEFAULT = {
  representation: 'Surface',
};

// ----------------------------------------------------------------------------
// vtkGlyphRepresentationProxy methods
// ----------------------------------------------------------------------------

function vtkGlyphRepresentationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGlyphRepresentationProxy');

  // Internals
  model.mapper = vtkGlyph3DMapper.newInstance({
    interpolateScalarsBeforeMapping: true,
    useLookupTableScalarRange: true,
    scalarVisibility: false,
  });

  publicAPI.setPlacement = (inputDataSet) => {
      console.log('GlyphRepresentationProxy:39')
      console.log(typeof inputDataSet)
      console.log(inputDataSet)
      model.mapper.setInputData(inputDataSet, 0);
//      model.mapper.setInputData(inputDataSet.getPlacement(), 0);
//      model.mapper.setInputData(inputDataSet.getPrototype(), 1);
  };

  publicAPI.setPrototype = (inputDataSet) => {
      console.log('GlyphRepresentationProxy:48')
      console.log(typeof inputDataSet)
      console.log(inputDataSet)
      model.mapper.setInputData(inputDataSet, 1);
//      model.mapper.setInputData(inputDataSet.getPlacement(), 0);
//      model.mapper.setInputData(inputDataSet.getPrototype(), 1);
  };

//  function setPlacement(inputDataSet) {
//      console.log('GlyphRepresentationProxy:39')
//      console.log(typeof inputDataSet)
//      console.log(inputDataSet)
//      model.mapper.setInputData(inputDataSet, 0);
////      model.mapper.setInputData(inputDataSet.getPlacement(), 0);
////      model.mapper.setInputData(inputDataSet.getPrototype(), 1);
//  }

//  function setPrototype(inputDataSet) {
//      console.log('GlyphRepresentationProxy:48')
//      console.log(typeof inputDataSet)
//      console.log(inputDataSet)
//      model.mapper.setInputData(inputDataSet, 1);
////      model.mapper.setInputData(inputDataSet.getPlacement(), 0);
////      model.mapper.setInputData(inputDataSet.getPrototype(), 1);
//  }

  // Auto connect mappers
  model.sourceDependencies.push({ setInputData: publicAPI.setPlacement });
  // connect rendering pipeline
  model.actor = vtkActor.newInstance();
  model.property = model.actor.getProperty();
  model.actor.setMapper(model.mapper)
  model.actors.push(model.actor);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  representation: 'Surface',
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkAbstractRepresentationProxy.extend(publicAPI, model);

  // Object specific methods
  vtkGlyphRepresentationProxy(publicAPI, model);

  // Map proxy properties
  macro.proxyPropertyState(
    publicAPI,
    model,
    PROPERTIES_STATE,
    PROPERTIES_DEFAULT
  );
  macro.proxyPropertyMapping(publicAPI, model, {
    opacity: { modelKey: 'property', property: 'opacity' },
    visibility: { modelKey: 'actor', property: 'visibility' },
    color: { modelKey: 'property', property: 'diffuseColor' },
    interpolateScalarsBeforeMapping: {
      modelKey: 'mapper',
      property: 'interpolateScalarsBeforeMapping',
    },
    pointSize: { modelKey: 'property', property: 'pointSize' },
    useShadow: { modelKey: 'property', property: 'lighting' },
    useBounds: { modelKey: 'actor', property: 'useBounds' },
  });
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(
  extend,
  'vtkGlyphRepresentationProxy'
);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
