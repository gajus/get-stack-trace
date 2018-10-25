// @flow

/* eslint-disable import/exports-last, flowtype/require-types-at-top */

/**
 * @see https://github.com/v8/v8/wiki/Stack-Trace-API#customizing-stack-traces
 */
export type CallSiteType = {|
  +getColumnNumber: () => number,
  +getEvalOrigin: () => string,
  +getFileName: () => string | void,
  // eslint-disable-next-line flowtype/no-weak-types
  +getFunction: () => Function | void,
  +getFunctionName: () => string,
  +getLineNumber: () => number,
  +getMethodName: () => string,
  // eslint-disable-next-line flowtype/no-weak-types
  +getThis: () => Object | void,
  +getTypeName: () => string,
  +isConstructor: () => boolean,
  +isEval: () => boolean,
  +isNative: () => boolean,
  +isToplevel: () => boolean
|};

export type MaterializedCallSiteType = {|
  +callSiteIsConstructor: boolean,
  +callSiteIsEval: boolean,
  +callSiteIsNative: boolean,
  +callSiteIsTopLevel: boolean,
  +columnNumber: number,
  +evalOrigin: string,
  +fileName: string | void,
  // eslint-disable-next-line flowtype/no-weak-types
  +function: Function | void,
  +functionName: string | void,
  +lineNumber: number,
  +methodName: string | void,
  // eslint-disable-next-line flowtype/no-weak-types
  +this: Object | void,
  +typeName: string
|};

type NormalisedCallSiteType = {|
  +columnNumber: string,
  +fileName: string,
  +lineNumber: string
|};

export type ResolvedCallSiteType = {|
  +callSite: CallSiteType,
  +originalNormalisedCallSite: NormalisedCallSiteType,
  +reportedNormalisedCallSite: NormalisedCallSiteType
|};
