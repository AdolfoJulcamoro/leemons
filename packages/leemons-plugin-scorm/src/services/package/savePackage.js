const _ = require('lodash');
const { validateSavePackage, savePackageSchema } = require('../../validations/forms');

async function savePackage(scormData, { userSession, transacting } = {}) {
  const data = _.cloneDeep(scormData);
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;

  // Check is userSession is provided
  if (!userSession) throw new Error('User session is required (savePackage)');

  // Clean data
  if (!savePackageSchema.additionalProperties) {
    const allowedProps = Object.keys(savePackageSchema.properties);
    Object.keys(data).forEach((key) => {
      if (!allowedProps.includes(key)) delete data[key];
    });
  }

  validateSavePackage(data);

  const toSave = {
    asset: {
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      color: data.color,
      cover: data.cover?.id ? data.cover.id : data.cover,
      tags: data.tags,
      indexable: true,
      public: true, // TODO Cambiar a false despues de la demo
    },
    role: 'scorm',
    statement: '',
    subjects: _.map(data.subjects, ({ level, subject }) => ({
      level,
      subject,
      program: data.program,
    })),
    gradable: data.gradable || false,
    metadata: {
      version: data.version,
      launchUrl: data.launchUrl,
      file: data.file,
    },
  };

  let assignable = null;

  if (data.id) {
    delete toSave.role;
    assignable = await assignableService.updateAssignable(
      { id: data.id, ...toSave },
      {
        userSession,
        transacting,
        published: data.published,
      }
    );
  } else {
    assignable = await assignableService.createAssignable(toSave, {
      userSession,
      transacting,
      published: data.published,
    });
  }

  return assignable;
}

module.exports = savePackage;
