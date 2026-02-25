## 2025-06-03 - [Responsive Spinners]
**Learning:** `execSync` blocks the Node.js event loop, causing `ora` spinners to freeze.
**Action:** Use `promisify(exec)` or `child_process.exec` for long-running CLI operations to keep spinners animated.
