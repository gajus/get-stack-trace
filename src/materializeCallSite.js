// @flow

import type {
  CallSiteType,
  MaterializedCallSiteType,
} from './types';

export default (callSite: CallSiteType): MaterializedCallSiteType => {
  return {
    callSiteIsConstructor: callSite.isConstructor(),
    callSiteIsEval: callSite.isEval(),
    callSiteIsNative: callSite.isNative(),
    callSiteIsTopLevel: callSite.isToplevel(),
    columnNumber: callSite.getColumnNumber(),
    evalOrigin: callSite.getEvalOrigin(),
    fileName: callSite.getFileName() || null,
    function: callSite.getFunction() || null,
    functionName: callSite.getFunctionName(),
    lineNumber: callSite.getLineNumber(),
    methodName: callSite.getMethodName(),
    this: callSite.getThis() || null,
    typeName: callSite.getTypeName(),
  };
};
