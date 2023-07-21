#!/usr/bin/env -S node --no-warnings
const { JSDOM } = require('jsdom');
const chalk = require('chalk');
const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0';
function listHeadlines(url, title, selector) {
  return fetch(url, { headers: { 'User-Agent': ua } })
    .then((res) => res.text())
    .then((text) => {
      const doc = new JSDOM(text).window.document;
      const titles = Array.from(doc.querySelectorAll(selector)).map((el) => el.textContent.trim());
      console.log(`====== [${chalk.yellow(title)}] ======`);
      titles.forEach((text) => console.log(`* ${text}`));
    });
}
listHeadlines('https://www.reuters.com/news/archive/worldNews', 'Reuters', 'h3.story-title');
listHeadlines('https://hvg.hu/', 'HVG', '.h500.articlebox h1.heading-3');
