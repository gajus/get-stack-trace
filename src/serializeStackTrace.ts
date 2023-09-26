import { type StackTrace } from './types';

export const serializeStackTrace = (
  constructorName: string,
  errorMessage: string,
  stackTrace: StackTrace,
) => {
  return (
    constructorName +
    ': ' +
    errorMessage +
    '\n' +
    stackTrace.callSites
      .map((stackFrame) => {
        const { columnNumber, fileName, functionName, lineNumber } = stackFrame;

        if (!functionName) {
          return '    at ' + fileName + ':' + lineNumber + ':' + columnNumber;
        }

        // eslint-disable-next-line prettier/prettier
      return '    at ' + functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
      })
      .join('\n')
  );
};
