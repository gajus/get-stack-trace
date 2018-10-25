// @flow

import test from 'ava';
import {
  getStackTrace
} from '../../src';

test('creates a stack trace', async (t) => {
  const stackTrace = await getStackTrace();

  t.true(stackTrace[0].functionName === null);
  t.true(stackTrace[0].fileName && stackTrace[0].fileName.includes('test/roarr/getStackTrace.js'));
});
