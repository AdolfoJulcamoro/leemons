const _ = require('lodash');
const getProfileRole = require('./getProfileRole');
const removePermissionsByName = require('../roles/removePermissionsByName');
const { table } = require('../tables');
const { addPermissionMany, add } = require('../roles');
const { validatePermissionName } = require('../../validations/exists');
const {
  markAllUsersWithProfileToReloadPermissions,
} = require('./markAllUsersWithProfileToReloadPermissions');

/**
 * Create all roles for profiles por all centers in platform
 * @public
 * @static
 * @param {string | string[]} profileIds - Profile ids
 * @param {any} _transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function createNecessaryRolesForProfilesAccordingToCenters(
  profileIds,
  { transacting: _transacting }
) {
  return global.utils.withTransaction(
    async (transacting) => {
      // ES: Si no vienen ids de perfiles sacamos todos los perfiles si vienen solo sacamos esos
      const query = {};
      if (profileIds) {
        query.id_$in = _.isArray(profileIds) ? profileIds : [profileIds];
      }
      const [profiles, centers] = await Promise.all([
        table.profiles.find(query, { columns: ['id'], transacting }),
        table.centers.find({}, { columns: ['id'], transacting }),
      ]);

      const [centerRoles, profileRoles] = await Promise.all([
        table.roleCenter.find({ center_$in: _.map(centers, 'id') }, { transacting }),
        table.profileRole.find({ profile_$in: _.map(profiles, 'id') }, { transacting }),
      ]);

      const profileRolesByProfile = _.groupBy(profileRoles, 'profile');

      const needToCreate = [];
      _.forEach(profiles, (profile) => {
        _.forEach(centers, (center) => {
          /*
           * ES: Si no hay perfiles por role significa que el perfil por el que iteramos aun no
           * tiene ningun rol creado, significa que siempre entrara al else y añadira n registros
           * segun n centros existan
           * */
          if (profileRolesByProfile[profile.id]) {
            /*
             * Si el perfil tiene roles tenemos que comprobar para cada centro si alguno de esos
             * roles ya esta en ese centro, si ninguno esta añadimos como que hay que crearlo
             * */
            let found = false;
            _.forEach(profileRolesByProfile[profile.id], ({ role }) => {
              if (_.findIndex(centerRoles, { center: center.id, role }) >= 0) {
                found = true;
                return false;
              }
            });
            if (!found) {
              needToCreate.push({ profile: profile.id, center: center.id });
            }
          } else {
            needToCreate.push({ profile: profile.id, center: center.id });
          }
        });
      });

      await Promise.all(
        _.map(needToCreate, ({ profile, center }) =>
          leemons.plugin.services.roles.add(
            {
              name: `${profile}:${center}`,
              type: leemons.plugin.prefixPN('profile'),
              center,
              profile,
            },
            { transacting }
          )
        )
      );

      return true;
    },
    table.profileRole,
    _transacting
  );
}

module.exports = createNecessaryRolesForProfilesAccordingToCenters;
