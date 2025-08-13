// Simple test using Node's built-in test module
import { test } from 'node:test';
import assert from 'node:assert';

test('simple test', (t) => {
  console.log('Running Node.js test...');
  assert.strictEqual(1 + 1, 2);
});
