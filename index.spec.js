/**
 * @description - plugin original css
 * @author - bornkiller <hjj491229492@hotmail.com>
 */
const assert = require('assert');
const rollup = require('rollup');
const sassy = require('./');

// standard directory change
describe('rollup-plugin-sassy', function () {
  it('convert scss', function () {
    return rollup.rollup({
      entry: 'test/sassy.js',
      plugins: [sassy()]
    }).then((bundle) => {
      let { code } = bundle.generate({ format: 'es' });
      let fn = new Function('assert', code);

      fn(assert);
    });
  });

  it('support coco strategy', function () {
    return rollup.rollup({
      entry: 'test/coco.js',
      plugins: [
        sassy({
          strategy: 'CocoPrivate'
        })
      ]
    }).then((bundle) => {
      let { code } = bundle.generate({ format: 'es' });
      let fn = new Function('assert', code);

      fn(assert);
    });
  });
});
