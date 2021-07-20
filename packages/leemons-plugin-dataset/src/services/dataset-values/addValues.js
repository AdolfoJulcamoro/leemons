const _ = require('lodash');
const getSchema = require('../dataset-schema/getSchema');
const getKeysCanAction = require('./getKeysCanAction');
const { validateExistValues } = require('../../validations/exists');
const { validatePluginName } = require('../../validations/exists');
const { table } = require('../tables');

/** *
 *  ES:
 *  Si ya existen valores para los datos especificados devolvemos un error, si no
 *  se comprueba con ajv que los datos pasados cumplen con lo descrito en el schema y se almacenan
 *  los campos
 *
 *  EN:
 *  If values already exist for the specified data we return an error, otherwise we return an error.
 *  the data passed is checked with ajv to ensure that it complies with the schema and stored.
 *  the fields
 *
 *  @public
 *  @static
 *  @param {string} locationName Location name (For backend)
 *  @param {string} pluginName Plugin name (For backend)
 *  @param {any} _formData Form data to save
 *  @param {any=} transacting - DB Transaction
 *  @param {string=} target Any string to differentiate what you want, for example a user id.
 *  @param {UserAuth} userAuth - User auth
 *  @return {Promise<any>} Passed formData
 *  */
async function addValues(
  locationName,
  pluginName,
  _formData,
  userAuth,
  { target, transacting } = {}
) {
  validatePluginName(pluginName, this.calledFrom);
  await validateExistValues(locationName, pluginName, target, { transacting });

  const { jsonSchema } = await getSchema.call(this, locationName, pluginName);

  // ES: Cogemos solos los campos a los que el usuario tiene permiso de edicion
  // EN: We take only the fields to which the user has permission to edit.
  const goodKeys = await getKeysCanAction(locationName, pluginName, userAuth, 'edit');
  const formData = {};
  _.forEach(goodKeys, (k) => {
    formData[k] = _formData[k];
  });

  // ES: Comprobamos que los datos cumplen con la validacion
  // EN: We check that the data complies with validation
  const validator = new global.utils.LeemonsValidator(
    {
      ...jsonSchema,
      additionalProperties: false,
    },
    { strict: false }
  );
  if (!validator.validate(formData)) throw validator.error;

  const toSave = [];
  _.forIn(formData, (value, key) => {
    const data = { locationName, pluginName, key, value: JSON.stringify(value) };
    if (target) data.target = target;
    toSave.push(data);
  });

  await table.datasetValues.createMany(toSave, { transacting });

  return formData;
}

module.exports = addValues;