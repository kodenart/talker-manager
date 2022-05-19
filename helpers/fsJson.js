const { writeFile, readFile } = require('fs/promises');

const writeJson = (path, content) => writeFile(path, JSON.stringify(content));

const readJson = (path) => readFile(path, 'utf-8').then((r) => JSON.parse(r));

module.exports = { writeJson, readJson };