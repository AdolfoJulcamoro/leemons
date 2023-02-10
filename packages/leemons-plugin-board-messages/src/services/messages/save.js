const _ = require('lodash');
const { validateSaveMessage } = require('../../validations/forms');
const { table } = require('../tables');
const { byIds } = require('./byIds');
const { calculeStatusFromDates } = require('./calculeStatusFromDates');
const { getOverlapsWithOtherConfigurations } = require('./getOverlapsWithOtherConfigurations');

async function save(_data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateSaveMessage(_data, { transacting });
      // eslint-disable-next-line prefer-const
      let { id, centers, profiles, classes, programs, startDate, endDate, ...data } = _data;

      const overlaps = await getOverlapsWithOtherConfigurations(_data);
      // TODO Hacer algo cuando haya solapamientos (lanzar error / desactivar las otras configuraciones)

      if (overlaps.length) {
        throw new Error('Has overlaps');
      }

      if (!startDate || data.publicationType === 'immediately') {
        startDate = new Date();
      }
      if (!endDate || data.publicationType === 'immediately') {
        endDate = new Date('01/01/9999');
      }

      const status = calculeStatusFromDates(startDate, endDate);

      let item = null;
      if (id) {
        // Si hay id borramos todas las relaciones de centros/perfiles/classes/programas por que las vamos a crear de nuevo.
        await Promise.all([
          table.messageConfigCenters.deleteMany({ messageConfig: id }, { transacting }),
          table.messageConfigClasses.deleteMany({ messageConfig: id }, { transacting }),
          table.messageConfigProfiles.deleteMany({ messageConfig: id }, { transacting }),
          table.messageConfigPrograms.deleteMany({ messageConfig: id }, { transacting }),
        ]);
        item = await table.messageConfig.update(
          { id },
          { ...data, startDate, endDate, status },
          { transacting }
        );
      } else {
        item = await table.messageConfig.create(
          { ...data, startDate, endDate, status },
          { transacting }
        );
      }

      const promises = [];

      _.forEach(centers, (center) => {
        promises.push(
          table.messageConfigCenters.create({ messageConfig: item.id, center }, { transacting })
        );
      });
      _.forEach(profiles, (profile) => {
        promises.push(
          table.messageConfigProfiles.create({ messageConfig: item.id, profile }, { transacting })
        );
      });
      _.forEach(classes, (classe) => {
        promises.push(
          table.messageConfigClasses.create(
            { messageConfig: item.id, class: classe },
            { transacting }
          )
        );
      });
      _.forEach(programs, (program) => {
        promises.push(
          table.messageConfigPrograms.create({ messageConfig: item.id, program }, { transacting })
        );
      });

      await Promise.all(promises);

      return (await byIds(item.id, { userSession, transacting }))[0];
    },
    table.messageConfig,
    _transacting
  );
}

module.exports = { save };