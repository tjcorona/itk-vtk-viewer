import macro from 'vtk.js/Sources/macro';

// ----------------------------------------------------------------------------
// vtkGlyphSourceProxy methods
// ----------------------------------------------------------------------------

function vtkGlyphSourceProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGlyphSourceProxy');

  // --------------------------------------------------------------------------

  publicAPI.setPrototype = (ds, type) => {
    if (model.prototype !== ds) {
      model.prototype = ds;
      model.type = type || ds.getClassName();
      publicAPI.modified();
      publicAPI.invokeDatasetChange();
    }
  };

  publicAPI.setPlacement = (ds, type) => {
    if (model.placement !== ds) {
      model.placement = ds;
      model.type = type || ds.getClassName();
      publicAPI.modified();
      publicAPI.invokeDatasetChange();
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.update = () => {
  };

  publicAPI.getUpdate = () => model.algo.getMTime() > model.dataset.getMTime();

  // --------------------------------------------------------------------------
  // Initialisation
  // --------------------------------------------------------------------------

  publicAPI.update();
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  name: 'Default glyph source',
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, [
    'name',
    'type',
    'prototype',
    'placement',
  ]);
  macro.set(publicAPI, model, ['name']);
  macro.event(publicAPI, model, 'DatasetChange');
  macro.proxy(publicAPI, model);

  // Object specific methods
  vtkGlyphSourceProxy(publicAPI, model);

  if (model.proxyPropertyMapping) {
    macro.proxyPropertyMapping(publicAPI, model, model.proxyPropertyMapping);
  }
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkGlyphSourceProxy');

// ----------------------------------------------------------------------------

export default {
  newInstance,
  extend,
};
