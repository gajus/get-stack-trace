// @flow

import fs from 'fs';
import path from 'path';
import {
  SourceMapConsumer
} from 'source-map';
import isCallSiteSourceCodeLocationResolvable from './isCallSiteSourceCodeLocationResolvable';
import isReadableFile from './isReadableFile';
import type {
  CallSiteType,
  SourceCodeLocationType
} from './types';

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
    lineNumber
  };

  if (isReadableFile(maybeMapFilePath)) {
    const rawSourceMap = JSON.parse(fs.readFileSync(maybeMapFilePath, 'utf8'));

    const consumer = await new SourceMapConsumer(rawSourceMap);

    const originalPosition = consumer.originalPositionFor({
      column: columnNumber,
      line: lineNumber
    });

    await consumer.destroy();

    if (originalPosition.source) {
      reportedNormalisedCallSite = {
        columnNumber: originalPosition.column,
        fileName: path.resolve(path.dirname(fileName)),
        lineNumber: originalPosition.line
      };
    }
  }

  return reportedNormalisedCallSite;
};
