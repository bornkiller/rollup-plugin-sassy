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
    const bundle = rollup.rollup({
      entry: 'test/sassy.js',
      plugins: [sassy()]
    });

    return bundle.then((bundle) => bundle.generate({ format: 'es' }))
      .then(({ code }) => new Function('assert', code))
      .then((fn) => fn(assert));
  });

  it('support coco strategy', function () {
    const bundle = rollup.rollup({
      entry: 'test/coco.js',
      plugins: [
        sassy({
          strategy: 'CocoPrivate'
        })
      ]
    });

    return bundle.then((bundle) => bundle.generate({ format: 'es' }))
      .then(({ code }) => new Function('assert', code))
      .then((fn) => fn(assert));
  });
});
