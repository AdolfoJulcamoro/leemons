const table = {
  questionBankSubjects: leemons.query('plugins_tests::question-bank-subjects'),
  questionBankCategories: leemons.query('plugins_tests::question-bank-categories'),
  questionsBanks: leemons.query('plugins_tests::questions-banks'),
  questionsTests: leemons.query('plugins_tests::questions-tests'),
  questions: leemons.query('plugins_tests::questions'),
  tests: leemons.query('plugins_tests::tests'),
};

module.exports = { table };