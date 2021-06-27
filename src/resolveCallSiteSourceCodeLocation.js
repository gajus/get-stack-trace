// @flow

import fs from 'fs';
import {promisify} from 'util';
import path from 'path';
import {
  SourceMapConsumer,
  NullableMappedPosition,
  BasicSourceMapConsumer,
} from 'source-map';
import isCallSiteSourceCodeLocationResolvable from './isCallSiteSourceCodeLocationResolvable';
import isReadableFile from './isReadableFile';
import type {
  CallSiteType,
  SourceCodeLocationType,
} from './types';

const readFile = promisify(fs.readFile);

const cachedSourceMaps: { [string]: Promise<BasicSourceMapConsumer> | typeof undefined, ... } = {};

const resolveOriginalPosition = async (mapFilePath: string, column: number, line: number): Promise<NullableMappedPosition> => {
  let sourceMapResult = cachedSourceMaps[mapFilePath];

  if (!sourceMapResult) {
    sourceMapResult = (async () => {
      const rawSourceMap = JSON.parse(await readFile(mapFilePath, 'utf8'));

      return new SourceMapConsumer(rawSourceMap);
    })();

    cachedSourceMaps[mapFilePath] = sourceMapResult;
  }

  const sourceMap = await sourceMapResult;

  return sourceMap.originalPositionFor({
    column,
    line,
  });
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
