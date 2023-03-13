module.exports = {
  modelName: 'grade-tags',
  collectionName: 'grades-tags',
  options: {
    useTimestamps: true,
  },
  attributes: {
    description: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    letter: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    scale: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_grades::grade-scales',
      },
      */
    },
    grade: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_grades::grades',
      },
      */
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
