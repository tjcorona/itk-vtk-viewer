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
// vtkResourceRepresentationProxy methods
// ----------------------------------------------------------------------------

function vtkResourceRepresentationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkResourceRepresentationProxy');

  // Internals
  model.mapper = vtkMapper.newInstance({
    interpolateScalarsBeforeMapping: true,
    useLookupTableScalarRange: true,
    scalarVisibility: false,
  });
  model.actor = vtkActor.newInstance();
  model.property = model.actor.getProperty();

  model.glyphMapper = vtkGlyph3DMapper.newInstance({
    interpolateScalarsBeforeMapping: true,
    useLookupTableScalarRange: true,
    scalarVisibility: false,
  });

  publicAPI.setInputDataset = (ds, index) => {
    if (index === 0) {
      model.mapper.setInputData(ds);
    }
    else if (index === 1) {
      model.mapper.setInputData(ds);
    }
    if (model.prototype !== ds) {
      model.prototype = ds;
      model.type = type || ds.getClassName();
      publicAPI.modified();
      publicAPI.invokeDatasetChange();
    }
  };

  function updateMappers(inputDataSet) {
    console.log('ResourceRepresentationProxy:47')
    if (typeof inputDataSet === 'vtkGlyphSourceProxy') {
      model.glyphMapper.setInputData(inputDataSet.getPlacement(), 0);
      model.glyphMapper.setInputData(inputDataSet.getPrototype(), 1);
      model.mapper.setInputData(null);
    }
    else {
      model.mapper.setInputData(inputDataSet);
      model.glyphMapper.setInputData(null, 0);
      model.glyphMapper.setInputData(null, 1);
    }
  }

  // Auto connect mappers
  model.sourceDependencies.push({ setInputData: updateMappers });
  // connect rendering pipeline
  model.actor.setMapper(model.mapper);
  model.actors.push(model.actor);
  model.glyphActor = vtkActor.newInstance();
  model.glyphActor.setMapper(model.glyphMapper)
  model.actors.push(model.glyphActor);
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
  vtkResourceRepresentationProxy(publicAPI, model);

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
  'vtkResourceRepresentationProxy'
);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
