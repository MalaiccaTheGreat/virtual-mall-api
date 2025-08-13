// Simple test with no dependencies
console.log('Running simple test...');
console.log('1 + 1 =', 1 + 1);

if (1 + 1 === 2) {
  console.log('Test passed!');
  process.exit(0);
} else {
  console.error('Test failed!');
  process.exit(1);
}
