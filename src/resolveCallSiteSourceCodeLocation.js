// @flow

import fs from 'fs';
import {promisify} from 'util';
import path from 'path';
import {
  SourceMapConsumer,
  NullableMappedPosition,
} from 'source-map';
import isCallSiteSourceCodeLocationResolvable from './isCallSiteSourceCodeLocationResolvable';
import isReadableFile from './isReadableFile';
import type {
  CallSiteType,
  SourceCodeLocationType,
} from './types';

const readFile = promisify(fs.readFile);

const cachedOriginalLines: { [string]: Promise<NullableMappedPosition> | typeof undefined, ... } = {};

const resolveOriginalPosition = (mapFilePath: string, column: number, line: number): Promise<NullableMappedPosition> => {
  const lineKey = `${mapFilePath}-${line}-${column}`;

  // if possible, attempt to resolve the original lines from cache
  let originalLineResult = cachedOriginalLines[lineKey];

  if (!originalLineResult) {
    // Otherwise, consume the source map (hopefully from cache), and resolve the
    // original line numbers
    originalLineResult = (async () => {
      const sourceMapResult = JSON.parse(await readFile(mapFilePath, 'utf8'));

      return SourceMapConsumer.with(await sourceMapResult, undefined, (source) => {
        return source.originalPositionFor({
          column,
          line,
        });
      });
    })();
  }

  cachedOriginalLines[lineKey] = originalLineResult;

  return originalLineResult;
};

export default async (callSite: CallSiteType): Promise<SourceCodeLocationType> => {
  if (!isCallSiteSourceCodeLocationResolvable(callSite)) {
    throw new Error('Cannot resolve source code location.');
  }

  const columnNumber = callSite.getColumnNumber();
  const fileName = callSite.getFileName();
  const lineNumber = callSite.getLineNumber();

  if (!fileName) {
    throw new Error('Unexpected state.');
  }

  const maybeMapFilePath = fileName + '.map';

  let reportedNormalisedCallSite = {
    columnNumber,
    fileName,
    lineNumber,
  };

  if (isReadableFile(maybeMapFilePath)) {
    const originalPosition = await resolveOriginalPosition(maybeMapFilePath, columnNumber, lineNumber);

    if (originalPosition.source) {
      reportedNormalisedCallSite = {
        columnNumber: originalPosition.column,
        fileName: path.resolve(path.dirname(fileName), originalPosition.source),
        lineNumber: originalPosition.line,
      };
    }
  }

  return reportedNormalisedCallSite;
};
