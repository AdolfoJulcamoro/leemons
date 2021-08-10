const _ = require('lodash');
const schemaService = require('../src/services/dataset-schema');
const schemaLocaleService = require('../src/services/dataset-schema-locale');
const { translations } = require('../src/services/translations');

async function getSchema(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      locationName: { type: 'string' },
      pluginName: { type: 'string' },
    },
    required: ['locationName', 'pluginName'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const dataset = await schemaService.getSchema(
      ctx.request.body.locationName,
      ctx.request.body.pluginName
    );
    ctx.status = 200;
    ctx.body = { status: 200, dataset };
  } else {
    throw validator.error;
  }
}

async function getSchemaFieldLocale(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      locationName: { type: 'string' },
      pluginName: { type: 'string' },
      locale: { type: 'string' },
      item: { type: 'string' },
    },
    required: ['locationName', 'pluginName', 'locale', 'item'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    // TODO Esto es "inseguro" ya que se le esta pasando el calledFrom
    const { compileJsonSchema, compileJsonUI } = await schemaService.getSchemaWithLocale.call(
      { calledFrom: ctx.request.body.pluginName },
      ctx.request.body.locationName,
      ctx.request.body.pluginName,
      ctx.request.body.locale,
      { defaultWithEmptyValues: true }
    );
    ctx.status = 200;
    ctx.body = {
      status: 200,
      schema: compileJsonSchema.properties[ctx.request.body.item],
      ui: compileJsonUI[ctx.request.body.item],
    };
  } else {
    throw validator.error;
  }
}

async function saveField(ctx) {
  const schemaConfig = {
    type: 'object',
    properties: {
      schema: {
        type: 'object',
        additionalProperties: true,
      },
      ui: {
        type: 'object',
        additionalProperties: true,
      },
    },
    required: ['schema', 'ui'],
  };

  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      locationName: { type: 'string' },
      pluginName: { type: 'string' },
      schemaConfig,
      schemaLocales: {
        type: 'object',
        patternProperties: {
          [translations().functions.localeRegexString]: schemaConfig,
        },
      },
    },
    required: ['locationName', 'pluginName', 'schemaConfig', 'schemaLocales'],
    additionalProperties: false,
  });

  if (validator.validate(ctx.request.body)) {
    const dataset = await schemaService.saveField(
      ctx.request.body.locationName,
      ctx.request.body.pluginName,
      ctx.request.body.schemaConfig,
      ctx.request.body.schemaLocales
    );
    ctx.status = 200;
    ctx.body = { status: 200, dataset };
  } else {
    throw validator.error;
  }
}

async function removeField(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      locationName: { type: 'string' },
      pluginName: { type: 'string' },
      item: { type: 'string' },
    },
    required: ['locationName', 'pluginName', 'item'],
    additionalProperties: false,
  });

  if (validator.validate(ctx.request.body)) {
    const dataset = await schemaService.removeField(
      ctx.request.body.locationName,
      ctx.request.body.pluginName,
      ctx.request.body.item
    );
    ctx.status = 200;
    ctx.body = { status: 200, dataset };
  } else {
    throw validator.error;
  }
}

module.exports = {
  getSchema,
  saveField,
  removeField,
  getSchemaFieldLocale,
};