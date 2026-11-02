// Compatibility entry point. Publication now always covers the complete Core release.
const check = process.argv.indexOf('--check');
if (check >= 0) process.argv[check] = '--identity';
await import('./release-batch.mjs');
