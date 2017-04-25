/**
 * @description - implement css module transform
 * @author - bornkiller <hjj491229492@hotmail.com>
 */

const postcss = require('postcss');
const postCssModules = require('postcss-modules');
const { camelCase, keys } = require('lodash');
const Reflection = new Map();

module.exports = {
  Reflection,
  transformSassyFlow,
  fabricateSassyCode
};

/**
 * @description - transform sassy code with postcss
 *
 * @param {string} sassy
 * @param {string} id
 *
 * @returns {Promise}
 */
function transformSassyFlow(sassy, id) {
  let opts = {
    map: {
      inline: false,
      annotation: false
    }
  };

  return new Promise((resolve, reject) => {
    postcss([postCssModules({ getJSON: extractCssMappings(id) })])
      .process(sassy, opts)
      .then((result) => {
        resolve({
          css: result.css,
          connection: Reflection.get(id)
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @description - fabricate sassy code with css module connections
 *
 * @param {object} connection
 */
function fabricateSassyCode(connection) {
  let variable = `var sassy_fabrication = ${JSON.stringify(connection)};`;
  let defaultExports = `export default sassy_fabrication;\n\n`;
  let destructExports = keys(connection).map((key) => `export const ${key} = sassy_fabrication.${key}`);

  return [variable, defaultExports, ...destructExports].join('\n');
}

/**
 * @description - intercept css module mappings
 *
 * @param {string} id
 *
 * @returns {Function}
 */
function extractCssMappings(id) {
  return function (filename, mappings) {
    Reflection.set(id, keys(mappings).reduce((prev, curr) => {
      prev[camelCase(curr)] = mappings[curr];
      return prev;
    }, {}));
  };
}
