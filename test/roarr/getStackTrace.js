// @flow

import test from 'ava';
import {
  getStackTrace,
  materializeCallSite
} from '../../src';

test('creates a stack trace', async (t) => {
  const stackTrace = await getStackTrace();

  const materializedCallSite = materializeCallSite(stackTrace[0]);

  t.true(materializedCallSite.functionName === null);
  t.true(materializedCallSite.fileName && materializedCallSite.fileName.includes('test/roarr/getStackTrace.js'));
});
