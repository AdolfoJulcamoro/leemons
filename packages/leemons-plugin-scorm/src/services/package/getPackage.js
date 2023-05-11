const _ = require('lodash');

async function getPackage(id, { userSession, transacting } = {}) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;
  const { files: fileService } = leemons.getPlugin('leebrary').services;

  // Check is userSession is provided
  if (!userSession) throw new Error('User session is required (getPackage)');

  const ids = _.isArray(id) ? id : [id];

  const assignables = await Promise.all(
    _.map(ids, (_id) =>
      assignableService.getAssignable(_id, {
        userSession,
        withFiles: true,
        transacting,
      })
    )
  );

  // Get the files in metadata
  const files = await fileService.getByIds(assignables.map((a) => a.metadata.file).filter(Boolean));

  const result = _.map(assignables, (assignable) => {
    const { asset, metadata, statement } = assignable;
    const toReturn = {
      id: assignable.id,
      asset,
      statement,
      name: asset.name,
      tags: asset.tags,
      color: asset.color,
      cover: asset.cover,
      tagline: asset.tagline,
      description: asset.description,
      file: files.find((f) => f.id === metadata.file),
      launchUrl: metadata.launchUrl,
      version: metadata.version,
    };
    return toReturn;
  });
  return _.isArray(id) ? result : result[0];
}

module.exports = getPackage;
