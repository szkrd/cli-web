const sh = require('shelljs');
sh.config.silent = true;
sh.mkdir('~/bin');
const appDir = process.argv[1].replace(/scripts[/\\]install\.js$/, '');
let createCmd;
if (process.platform === 'win32') {
  createCmd = (fn) => sh.echo(`@node ${appDir}${fn}.js`).to(`~/bin/${fn}.cmd`);
}
sh.ls(appDir)
  .filter((fn) => fn.endsWith('.js'))
  .map((fn) => fn.replace(/\.js$/, ''))
  .forEach(createCmd);
console.log('done.');
