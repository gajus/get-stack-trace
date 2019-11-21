// @flow

import Bluebird from 'bluebird';
import isCallSiteSourceCodeLocationResolvable from './isCallSiteSourceCodeLocationResolvable';
import materializeCallSite from './materializeCallSite';
import resolveCallSiteSourceCodeLocation from './resolveCallSiteSourceCodeLocation';
import type {
  CallSiteType,
  MaterializedCallSiteType,
} from './types';

export default (): Promise<$ReadOnlyArray<MaterializedCallSiteType>> => {
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

  const trail: $ReadOnlyArray<CallSiteType> = callSites.slice(1);

  return Bluebird
    .resolve(trail)
    .map(async (callSite) => {
      if (!isCallSiteSourceCodeLocationResolvable(callSite)) {
        return materializeCallSite(callSite);
      }

      return {
        ...materializeCallSite(callSite),
        ...await resolveCallSiteSourceCodeLocation(callSite),
      };
    });
};
