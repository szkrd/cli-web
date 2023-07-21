#!/usr/bin/env -S node --no-warnings
const { JSDOM } = require('jsdom');
const chalk = require('chalk');
const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0';
const url = [
  'https://www.nnk.gov.hu/index.php/kozegeszsegugyi-laboratoriumi-foosztaly/256-kornyezetegeszsegugyi-laboratoriumi-osztaly/levegohigienes-laboratorium/lakossagi-tajekoztato-tartalmak/polleninformaciok-megjelenitese/1237-napi-pollenjelentes',
  '?option=com_grid',
  '&gid=1_sy_0',
  '&o_b=datum',
  '&o_d=DESC',
  '&p=0',
  '&rpp=24',
  '&data_search=datum||hely|20_BUDAPEST|noveny||ertek||',
  '&ajax=1',
].join('');

const getCell = (cells, n) => cells[n].textContent.trim();
const printLevel = (level) =>
  ({
    'nagyon magas': chalk.magenta('+++++'),
    magas: chalk.red('++++ '),
    közepes: chalk.yellow('+++  '),
    alacsony: chalk.gray('++   '),
    'nagyon alacsony': chalk.gray('+    '),
  }[level] ?? '?');
const printPlant = (plant) => plant.replace(/\(([^)]*)\)/, chalk.gray('($1)'));

return fetch(url, { headers: { 'User-Agent': ua } })
  .then((res) => res.text())
  .then((text) => {
    const doc = new JSDOM(`<html><body>${text}</body></html>`).window.document;
    const rows = Array.from(doc.querySelectorAll('html body form table tbody tr'));
    const results = [];
    let newestDate = '';
    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td'));
      if (cells.length != 4) return;
      const val = (n) => getCell(cells, n);
      if (val(1).toLowerCase() != 'budapest') return;
      if (val(3) === 'nincs jelen') return;
      if (!newestDate) newestDate = val(0);
      if (newestDate !== val(0)) return;
      results.push({ date: val(0), plant: val(2), level: val(3) });
    });
    if (newestDate) console.log(`==== ${chalk.cyan(newestDate)} ====`);
    results.forEach((row) => {
      console.log(`${printLevel(row.level)} ${chalk.gray('|')} ${printPlant(row.plant)}`);
    });
  });
