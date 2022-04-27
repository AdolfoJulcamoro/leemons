const questionsBanksService = require('../src/services/questions-banks');

async function listQuestionBanks(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      published: { type: ['boolean', 'string'] },
      query: { type: 'object', additionalProperties: true },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const { page, size, ...options } = ctx.request.body;
    const data = await questionsBanksService.list(parseInt(page, 10), parseInt(size, 10), {
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function saveQuestionBanks(ctx) {
  const questionBank = await questionsBanksService.save(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, questionBank };
}

async function getQuestionBankDetail(ctx) {
  const [questionBank] = await questionsBanksService.details(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, questionBank };
}

module.exports = {
  listQuestionBanks,
  saveQuestionBanks,
  getQuestionBankDetail,
};