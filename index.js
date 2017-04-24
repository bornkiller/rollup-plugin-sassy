/**
 * @description - plugin original css
 * @author - bornkiller <hjj491229492@hotmail.com>
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssModules = require('postcss-modules')({ getJSON: getJSON });
const { camelCase, keys } = require('lodash');

const pwd = process.cwd();
const source = path.resolve(pwd, 'test', 'fixture', 'sassy.css');
const destiny = path.resolve(pwd, 'dist', 'sassy.css');
const template = fs.readFileSync(source, { encoding: 'utf8' });

// variable intermediate
let reflection = {};

postcss([cssModules])
  .process(template, { from: source, to: destiny, map: true })
  .then((result) => {
    // console.log(result.css);
    console.log(reflection);
  });

function getJSON(filename, mappings) {
  reflection = keys(mappings).reduce((prev, curr) => {
    prev[camelCase(curr)] = mappings[curr];
    return prev;
  }, {});
}
