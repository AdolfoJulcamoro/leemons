module.exports = {
  modelName: 'assets-subjects',
  collectionName: 'assets-subjects',
  attributes: {
    asset: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    subject: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    level: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
