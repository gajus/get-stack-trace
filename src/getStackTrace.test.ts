import { getStackTrace } from './getStackTrace';
import { expect, test } from 'vitest';

test('gets stack trace', () => {
  const stackTrace = getStackTrace();

  expect(stackTrace[0].fileName).toMatch(/getStackTrace/u);
  expect(stackTrace[0].lineNumber).toBe(5);
  expect(stackTrace[0].columnNumber).toBe(22);
});
