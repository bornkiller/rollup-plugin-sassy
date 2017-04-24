/**
 * @description - plugin original css
 * @author - bornkiller <hjj491229492@hotmail.com>
 */

const path = require('path');
const postcss = require('postcss');
const postCssModules = require('postcss-modules');
const { camelCase, keys } = require('lodash');
const { createFilter } = require('rollup-pluginutils');

const defaults = {
  include: ['**/*.css']
};

module.exports = sassy;

function sassy(options = defaults) {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'sassy',
    transform(sassy, id) {
      if (!filter(id)) return null;

      let reflection = {};
      let opts = {
        from: options.from ? path.resolve(process.cwd(), options.from) : id,
        to: options.to ? path.resolve(process.cwd(), options.to) : id,
        map: {
          inline: false,
          annotation: false
        },
        parser: options.parser
      };

      return new Promise((resolve) => {
        postcss([postCssModules({ getJSON: getJSON })])
          .process(sassy, opts)
          .then((result) => {
            let exports = `let reflection = ${JSON.stringify(reflection)};`;
            let defaultExports = `export default reflection;\n\n`;
            let destructExports = keys(reflection).map((key) => `export const ${key} = reflection.${key}`);
            resolve({
              code: [exports, defaultExports, ...destructExports].join('\n'),
              map: { mappings: '' }
            });
          });
      });

      function getJSON(filename, mappings) {
        reflection = keys(mappings).reduce((prev, curr) => {
          prev[camelCase(curr)] = mappings[curr];
          return prev;
        }, {});
      }
    }
  };
}