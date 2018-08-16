// @flow

import fs from 'fs';
import path from 'path';
import Bluebird from 'bluebird';
import {
  SourceMapConsumer
} from 'source-map';
import type {
  CallSiteType,
  ResolvedCallSiteType
} from './types';

const getStackTrace = (): $ReadOnlyArray<CallSiteType> => {
  const oldStackTraceLimit = Error.stackTraceLimit;
  const oldPrepareStackTrace = Error.prepareStackTrace;

  Error.prepareStackTrace = (error, structuredStackTrace) => {
    return structuredStackTrace;
  };

  const honeypot = {};

  Error.captureStackTrace(honeypot);

  const callSites = honeypot.stack;

  Error.stackTraceLimit = oldStackTraceLimit;
  Error.prepareStackTrace = oldPrepareStackTrace;

  return callSites;
};

const isReadableFile = (filePath: string): boolean => {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);

    return true;
  } catch (error) {
    return false;
  }
};

const getOriginalStackTrace = (callSites: $ReadOnlyArray<CallSiteType>): Promise<$ReadOnlyArray<ResolvedCallSiteType>> => {
  return Bluebird
    .resolve(callSites)
    .map(async (callSite) => {
      const columnNumber = callSite.getColumnNumber();
      const fileName = callSite.getFileName();
      const lineNumber = callSite.getLineNumber();

      const maybeMapFilePath = callSite.getFileName() + '.map';

      const reportedNormalisedCallSite = {
        columnNumber,
        fileName,
        lineNumber
      };

      let originalNormalisedCallSite = null;

      if (isReadableFile(maybeMapFilePath)) {
        const rawSourceMap = JSON.parse(fs.readFileSync(maybeMapFilePath, 'utf8'));

        const consumer = await new SourceMapConsumer(rawSourceMap);

        const originalPosition = consumer.originalPositionFor({
          column: columnNumber,
          line: lineNumber
        });

        await consumer.destroy();

        originalNormalisedCallSite = {
          columnNumber: originalPosition.column,
          fileName: originalPosition.source ? path.resolve(path.basename(fileName), originalPosition.source) : null,
          lineNumber: originalPosition.line
        };
      }

      return {
        callSite,
        originalNormalisedCallSite,
        reportedNormalisedCallSite
      };
    });
};

export {
  getOriginalStackTrace,
  getStackTrace
};
