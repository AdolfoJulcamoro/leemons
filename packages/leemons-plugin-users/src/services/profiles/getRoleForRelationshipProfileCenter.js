const _ = require('lodash');
const { table } = require('../tables');

async function getRoleForRelationshipProfileCenter(profile, center, { transacting } = {}) {
  const profileRoles = await table.profileRole.find({ profile }, { transacting });
  const centerRole = await table.roleCenter.findOne(
    {
      center,
      role_$in: _.map(profileRoles, 'role'),
    },
    { transacting }
  );
  if (!centerRole)
    throw new Error(
      'Error de consistencia, siempre debe existir un Rol para un centro dado un perfil'
    );
  return table.roles.findOne({ id: centerRole.role }, { transacting });
}

module.exports = { getRoleForRelationshipProfileCenter };
