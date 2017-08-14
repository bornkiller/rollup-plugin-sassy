import stylesWithoutCSSModule from './sassy.scss';
import stylesWithCSSModule, { cocoFree } from './css-module.css';

assert.equal(stylesWithoutCSSModule, '');
assert.equal(stylesWithCSSModule.cocoFree, cocoFree);
