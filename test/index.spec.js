/**
 * @description - plugin original css
 * @author - bornkiller <hjj491229492@hotmail.com>
 */

const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const sassy = require('..');

// standard directory change
process.chdir(__dirname);

describe('rollup-plugin-sassy', function () {
  it('convert css', function () {
    return rollup.rollup({
      entry: 'fixture/sassy.js',
      plugins: [sassy()]
    }).then((bundle) => {
      let { code } = bundle.generate({ format: 'es'});

      console.log(code);
    })
  });
});