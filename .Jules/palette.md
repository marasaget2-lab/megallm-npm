## 2024-05-22 - [CLI Spinner Freezing]
**Learning:** `execSync` blocks the Node.js event loop, preventing `ora` spinners from animating. This creates a "frozen" UI feeling during long operations.
**Action:** Always use `util.promisify(exec)` or `spawn` for long-running CLI tasks to keep the UI responsive.
