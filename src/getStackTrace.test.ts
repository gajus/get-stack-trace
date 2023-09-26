import { getStackTrace } from './getStackTrace';
import { expect, test } from 'vitest';

test('gets stack trace', () => {
  const stackTrace = getStackTrace();

  expect(stackTrace.callSites[0].fileName).toMatch(/getStackTrace/u);
});
