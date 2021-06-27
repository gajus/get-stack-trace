import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import mockfs from 'mock-fs';
import test from 'ava';
import resolveCallSiteSourceCodeLocation from '../src/resolveCallSiteSourceCodeLocation';

const deleteFile = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);

const testSourceMap = {
  file: 'min.js',
  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA',
  names: [
    'bar',
    'baz',
    'n',
  ],
  sourceRoot: 'http://example.com/www/js/',
  sources: [
    'one.js',
    'two.js',
  ],
  version: 3,
};

mockfs({
  node_modules:
    mockfs.load('node_modules'),
  'testsource.map': JSON.stringify(testSourceMap),
});

test('caches source maps once theyve been read', async (t) => {
  const callSite1 = await resolveCallSiteSourceCodeLocation({
    getColumnNumber: () => {
      return 28;
    },
    getFileName: () => {
      return 'testsource';
    },
    getLineNumber: () => {
      return 2;
    },
  });

  t.deepEqual(callSite1, {columnNumber: 10,
    fileName: `${path.resolve(path.join(__dirname, '../'))}/http:/example.com/www/js/two.js`,
    lineNumber: 2});

  // // When we delete the map, we still expect the in memory map to be used
  await deleteFile('testsource.map');

  const callSite2 = await resolveCallSiteSourceCodeLocation({
    getColumnNumber: () => {
      return 10;
    },
    getFileName: () => {
      return 'testsource';
    },
    getLineNumber: () => {
      return 2;
    },
  });
  t.deepEqual(callSite2, {columnNumber: 11,
    fileName: `${path.resolve(path.join(__dirname, '../'))}/http:/example.com/www/js/two.js`,
    lineNumber: 1});
});

test('only attempts to access maps once', async (t) => {
  const callSite1 = await resolveCallSiteSourceCodeLocation({
    getColumnNumber: () => {
      return 28;
    },
    getFileName: () => {
      return 'somesource';
    },
    getLineNumber: () => {
      return 2;
    },
  });
  t.deepEqual(callSite1, {columnNumber: 28,
    fileName: 'somesource',
    lineNumber: 2});

  await writeFile('sourcesource', JSON.stringify(testSourceMap));

  // We don't expect it to attempt to read this source map again
  const callSite2 = await resolveCallSiteSourceCodeLocation({
    getColumnNumber: () => {
      return 28;
    },
    getFileName: () => {
      return 'somesource';
    },
    getLineNumber: () => {
      return 2;
    },
  });
  t.deepEqual(callSite2, {columnNumber: 28,
    fileName: 'somesource',
    lineNumber: 2});
});
