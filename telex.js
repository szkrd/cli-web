#!/usr/bin/env -S node --no-warnings
const { JSDOM } = require('jsdom');
const _ = require('lodash');
const chalk = require('chalk');
const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0';
const url = 'https://telex.hu/';
const allowedTags = ['Belföld', 'Külföld'];

function onContent(text = '') {
  const doc = new JSDOM(text).window.document;
  const tags = Array.from(doc.querySelectorAll('.tag__item'));
  const results = allowedTags.reduce((acc, val) => {
    acc[val] = [];
    return acc;
  }, {});

  tags.forEach((el, idx) => {
    const tagTxt = el.textContent.trim();
    if (!allowedTags.includes(tagTxt)) return;

    const details = el.closest('.item__details');
    if (details.tagName !== 'DIV') return;

    const title = details.querySelector('.item__title');
    if (title.tagName !== 'A') return;

    const titleTxt = title.textContent.trim();
    const url = title.getAttribute('href');

    const dateMatcher = url.match(/20\d{2}\/[0-1]\d\/[0-3]\d/);
    if (!dateMatcher || dateMatcher.length < 1) return;

    results[tagTxt].push({ date: dateMatcher[0], title: titleTxt, idx });
  });

  const today = new Date().toISOString().substring(0, 10).replace(/-/g, '/');
  allowedTags.forEach((tag) => {
    console.log(`====== [${chalk.yellow(tag)}] ======`);
    _.sortBy(results[tag], ['date'])
      .reverse()
      .forEach((detail) => {
        const dateColorizer = detail.date === today ? chalk.cyan : chalk.gray;
        console.log(`* ${dateColorizer(detail.date)} - ${detail.title}`);
      });
  });
}

fetch(url, { headers: { 'User-Agent': ua } })
  .then((res) => res.text())
  .then(onContent);
