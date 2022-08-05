const { add } = require('./add');
const { get } = require('./get');
const { exist } = require('./exist');
const { markAsRead } = require('./markAsRead');
const { getMessages } = require('./getMessages');
const { sendMessage } = require('./sendMessage');
const { addUserAgents } = require('./addUserAgents');
const { existUserAgent } = require('./existUserAgent');
const { removeUserAgents } = require('./removeUserAgents');

module.exports = {
  add,
  get,
  exist,
  markAsRead,
  getMessages,
  sendMessage,
  addUserAgents,
  existUserAgent,
  removeUserAgents,
};