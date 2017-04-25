/**
 * @description - plugin original css
 * @author - bornkiller <hjj491229492@hotmail.com>
 */

const path = require('path');
const fs = require('fs-promise');
const { keys, isFunction, isString } = require('lodash');
const { createFilter } = require('rollup-pluginutils');
const { fabricateSassyCode, transformSassyFlow } = require('./src/intermediate');

const defaults = {
  include: ['**/*.css'],
  dest: 'dist/sassy.css'
};

module.exports = sassy;

function sassy(opts) {
  const options = Object.assign({}, defaults, opts);
  const filter = createFilter(options.include, options.exclude);
  const styles = {};

  return {
    name: 'sassy',
    transform(sassy, id) {
      if (!filter(id)) return null;

      return transformSassyFlow(sassy, id)
        .then((intermediate) => {
          Reflect.set(styles, id, intermediate.css);

          return {
            code: fabricateSassyCode(intermediate.connection),
            map: { mappings: '' }
          };
        });
    },
    ongenerate() {
      let css = keys(styles).map((key) => Reflect.get(styles, key)).join('\n\n');
      let destiny = '';

      if (isFunction(options.output)) {
        return options.output(css, styles);
      }

      if (!css.length || !isString(options.dest)) return;

      destiny = options.dest || 'bundle.css';
      destiny = path.resolve(process.cwd(), destiny);

      return fs.ensureDir(path.dirname(destiny)).then(() => fs.writeFile(destiny, css));
    }
  };
}
