const ignoreBundle = !/^(false|0)?$/i.test(process.env.PIRAL_IGNORE_BUNDLE || '');
const extensionPath = ignoreBundle ? './out/extension' : './dist/extension';
module.exports = require(extensionPath);
