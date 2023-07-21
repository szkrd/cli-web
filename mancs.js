#!/usr/bin/env -S node --no-warnings
const { JSDOM } = require('jsdom');
const _ = require('lodash');
const chalk = require('chalk');
const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0';
const url = 'https://magyarnarancs.hu/';
const topicWhitelist = ['Külpol', 'Belpol'];

const getText = (el, sel) => {
  const foundEl = el.querySelector(sel);
  return (foundEl ? foundEl.textContent.trim() : '').replace(/\s+/g, ' ');
};

const splitToLines = (text, max = 80, prepend = '  ') => {
  const lines = [];
  const words = text.split(/\s+/);
  let line = '';
  words.forEach((word) => {
    if ((line + ' ' + word).length > max) {
      lines.push(line);
      line = '';
    }
    line += ' ' + word;
  });
  if (line) lines.push(line);
  return lines.map((line) => `${prepend}${line.trim()}`).join('\n');
};

function onContent(text = '') {
  const doc = new JSDOM(text).window.document;
  const mainTopic = Array.from(doc.querySelectorAll('.main .topic:first-of-type .card-body'));
  const items = [];
  mainTopic.forEach((el) => {
    items.push({
      topic: getText(el, '.card-topic'),
      title: getText(el, 'h3'),
      text: getText(el, '.card-text'),
    });
  });
  topicWhitelist.forEach((allowedTopic) => {
    if (items.filter((item) => item.topic === allowedTopic).length > 0) {
      console.log(`====== [${chalk.yellow(allowedTopic)}] ======`);
    }
    items.forEach((item) => {
      if (allowedTopic !== item.topic) return;
      console.log(`* ${chalk.white(item.title)}`);
      if (item.text) console.log(chalk.gray(splitToLines(item.text)));
    });
  });
}

fetch(url, { headers: { 'User-Agent': ua } })
  .then((res) => res.text())
  .then(onContent);
