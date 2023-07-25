const sh = require('shelljs');
sh.config.silent = true;
sh.mkdir('~/bin');
const appDir = process.argv[1].replace(/scripts[/\\]install\.js$/, '');
let createCmd;
if (process.platform === 'win32') {
  createCmd = (fn) => sh.echo(`@node ${appDir}${fn}.js`).to(`~/bin/${fn}.cmd`);
} else if (process.platform === 'linux') {
  createCmd = (fn) => {
    sh.echo(`#!/usr/bin/env bash\nnode ${appDir}${fn}.js`).to(`~/bin/${fn}`);
    sh.chmod('u+x', `~/bin/${fn}`);
  };
} else process.exit(1);
sh.ls(appDir)
  .filter((fn) => fn.endsWith('.js'))
  .map((fn) => fn.replace(/\.js$/, ''))
  .forEach(createCmd);
console.log('done.');
