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

module.exports = { splitToLines };
