import { getStackTrace } from './getStackTrace';
import { serializeStackTrace } from './serializeStackTrace';
import { expect, test } from 'vitest';

test('serializes stack traces', () => {
  const actual = serializeStackTrace('Error', 'bar', getStackTrace());
  const expected = String(new Error('bar').stack);

  expect(actual.split('\n')[0]).toBe(expected.split('\n')[0]);
});
