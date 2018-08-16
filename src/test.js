// @flow

/* eslint-disable no-console */

import {
  getOriginalStackTrace,
  getStackTrace
} from '.';

const main = async () => {
  const traces = await getOriginalStackTrace(getStackTrace());

  for (const trace of traces) {
    const oncs = trace.originalNormalisedCallSite;
    const rncs = trace.reportedNormalisedCallSite;

    console.log('---');
    console.log('originalNormalisedCallSite', oncs ? oncs.fileName + ':' + oncs.lineNumber + ':' + oncs.columnNumber : 'N/A');
    console.log('reportedNormalisedCallSite', rncs.fileName + ':' + rncs.lineNumber + ':' + rncs.columnNumber);
  }
};

main();
