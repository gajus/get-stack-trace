// @flow

import test from 'ava';
import {
  getStackTrace,
  materializeCallSite
} from '../../src';

test('uses individual CallSite methods to resolve the underlying values', async (t) => {
  const stackTrace = await getStackTrace();

  const materializedCallSite = materializeCallSite(stackTrace[0]);

  t.true(materializedCallSite.functionName === 'getStackTrace');
});
