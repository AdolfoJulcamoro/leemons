module.exports = {
  modelName: 'condition-groups',
  collectionName: 'condition-groups',
  options: {
    useTimestamps: true,
  },
  attributes: {
    // and | or
    operator: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    rule: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_grades::rules',
      },
      */
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
