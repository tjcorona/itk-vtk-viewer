import macro from 'vtk.js/Sources/macro';

// ----------------------------------------------------------------------------
// vtkGlyphSourceProxy methods
// ----------------------------------------------------------------------------

function vtkGlyphSourceProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGlyphSourceProxy');

  // --------------------------------------------------------------------------

  publicAPI.setPrototype = (ds, type) => {
    console.log('GlyphSource:14')
    if (model._prototype !== ds) {
      model._prototype = ds;
      model.type = type || ds.getClassName();
      publicAPI.modified();
      publicAPI.invokeDatasetChange();
    }
  };

  publicAPI.getPrototype = () => {
    console.log('GlyphSource:24')
    return model._prototype;
  };

  publicAPI.setPlacement = (ds, type) => {
    console.log('GlyphSource:29')
    if (model.placement !== ds) {
      model.placement = ds;
      model.type = type || ds.getClassName();
      publicAPI.modified();
      publicAPI.invokeDatasetChange();
    }
  };

  publicAPI.getPlacement = () => {
    console.log('GlyphSource:39')
    return model.placement;
  };

  publicAPI.getDataset = () => {
    console.log('GlyphSource:44')
    return model.placement;
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
