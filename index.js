/**
 * @description - plugin original css
 * @author - bornkiller <hjj491229492@hotmail.com>
 */

// Native
const path = require('path');
const fs = require('fs-extra');

// External
const { keys, isFunction, isString } = require('lodash');
const { createFilter } = require('rollup-pluginutils');

// Internal
const { compileSassCode, fabricateSassyCode, transformSassyFlow } = require('./src/intermediate');

// Scope
const defaults = {
  include: ['**/*.css', '**/*.scss'],
  exclude: ['node_modules/**', 'bower_components/**'],
  dest: 'dist/sassy.css',
  // node-sass options
  sass: {
    sourceMap: false,
    outputStyle: 'expanded'
  }
};
// Coco bundle private strategy, with strategy field
const CocoPrivateStrategy = 'CocoPrivate';

module.exports = sassy;

function sassy(opts = {}) {
  const options = Object.assign({}, defaults, opts);
  const filter = createFilter(options.include, options.exclude);
  const styles = {};

  return {
    name: 'sassy',
    transform(sassy, id) {
      if (!filter(id)) return null;

      const includePaths = opts.sass ? [...opts.sass.includePaths, path.dirname(id)] : [path.dirname(id)];
      const config = Object.assign({ data: sassy }, opts.sass, { includePaths: includePaths });

      if (options.strategy === CocoPrivateStrategy) {
        const extension = path.extname(id);

        if (extension === '.scss') {
          return compileSassCode(config).then((css) => {
            Reflect.set(styles, id, css);

            return {
              code: `export default ''`,
              map: { mappings: '' }
            };
          });
        }
      }

      return compileSassCode(config)
        .then((css) => transformSassyFlow(css, id))
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
