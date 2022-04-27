const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const { stringSchema, booleanSchema, stringSchemaNullable } = require('./types');

const saveQuestionBankSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    tagline: stringSchemaNullable,
    summary: stringSchemaNullable,
    color: stringSchemaNullable,
    cover: stringSchemaNullable,
    state: stringSchemaNullable,
    program: stringSchemaNullable,
    categories: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['value'],
        properties: {
          id: stringSchema,
          value: stringSchema,
        },
      },
    },
    subjects: {
      type: 'array',
      items: stringSchema,
    },
    tags: {
      type: 'array',
      items: stringSchema,
    },
    published: booleanSchema,
    questions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [],
        properties: {
          id: stringSchema,
          type: stringSchema,
          level: stringSchemaNullable,
          category: {
            type: ['string', 'number'],
            minLength: 1,
            maxLength: 255,
            nullable: true,
          },
          withImages: booleanSchema,
          tags: {
            type: 'array',
            items: stringSchema,
            nullable: true,
          },
          question: stringSchema,
          properties: {
            type: 'object',
            additionalProperties: true,
          },
          clues: {
            type: 'array',
            items: stringSchema,
            nullable: true,
          },
        },
      },
    },
  },
  required: [],
  additionalProperties: false,
};

function validateSaveQuestionBank(data) {
  const schema = _.cloneDeep(saveQuestionBankSchema);
  if (data.published) {
    schema.required = ['name', 'tagline', 'summary', 'questions', 'program', 'subjects'];
    schema.properties.questions.items.required = ['type', 'question'];
  }
  const validator = new LeemonsValidator(schema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const saveTestSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    type: stringSchemaNullable,
    tagline: stringSchemaNullable,
    summary: stringSchemaNullable,
    tags: {
      type: 'array',
      items: stringSchema,
    },
    level: stringSchemaNullable,
    statement: stringSchemaNullable,
    instructionsForTeacher: stringSchemaNullable,
    instructionsForStudent: stringSchemaNullable,
    questionBank: stringSchemaNullable,
    filters: {
      type: 'object',
      additionalProperties: true,
      nullable: true,
    },
    questions: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    published: booleanSchema,
  },
  required: ['name'],
  additionalProperties: false,
};

function validateSaveTest(data) {
  const schema = _.cloneDeep(saveTestSchema);
  if (data.published) {
    schema.required = [
      'name',
      'type',
      'tagline',
      'summary',
      'level',
      'questionBank',
      'questions',
      'statement',
    ];
  }
  const validator = new LeemonsValidator(schema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateSaveQuestionBank,
  validateSaveTest,
};