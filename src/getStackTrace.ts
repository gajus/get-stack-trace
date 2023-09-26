import { type StackTrace } from './types';
import { parse as parseStackTrace } from 'stacktrace-parser';

export const getStackTrace = (): StackTrace => {
  // The reason we are parsing the stack trace rather than
  // using captureStackTrace is because captureStackTrace
  // does not resolve source maps, i.e. the stack trace
  // will contain the compiled code references rather than
  // the original source code references.
  //
  // eslint-disable-next-line unicorn/error-message
  const stackTrace = new Error().stack;

  if (!stackTrace) {
    throw new Error('Could not get stack trace');
  }

  return parseStackTrace(stackTrace)
    .map((stackFrame) => {
      return {
        arguments: stackFrame.arguments,
        columnNumber: stackFrame.column,
        fileName: stackFrame.file,
        functionName: stackFrame.methodName,
        lineNumber: stackFrame.lineNumber,
      };
    })
    .slice(1);
};
