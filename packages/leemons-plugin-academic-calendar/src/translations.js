const constants = require('../config/constants');

module.exports = {
  translations: () => {
    const multilanguage = leemons.getPlugin('multilanguage');
    if (multilanguage) {
      return {
        common: multilanguage.services.common.getProvider(),
        contents: multilanguage.services.contents.getProvider(),
        locales: multilanguage.services.locales.getProvider(),
        functions: {
          isValidLocaleCode: leemons.getPlugin('multilanguage').services.locales.isValidLocaleCode,
          localeRegex: leemons.getPlugin('multilanguage').services.locales.localeRegex,
          localeRegexString: leemons.getPlugin('multilanguage').services.locales.localeRegexString,
        },
      };
    }
    return null;
  },
  /**
   * Return the key for translation
   * @public
   * @static
   * @param {string} locationName - Location name
   * @param {string} pluginName - Plugin name
   * @param {string=} key - Another key like description or my-property-to-translate
   * @return {string}
   * */
  getTranslationKey: (locationName, pluginName, key) => {
    const _pluginName = constants.pluginName;
    if (key) return `${_pluginName}.${locationName}.${pluginName}.${key}`;
    return `${_pluginName}.${locationName}.${pluginName}`;
  },
};