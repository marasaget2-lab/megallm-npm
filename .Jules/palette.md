## 2024-05-24 - Async CLI Spinners
**Learning:** Using `execSync` for long-running tasks blocks the Node.js event loop, causing `ora` spinners to freeze. This makes the CLI appear unresponsive.
**Action:** Always use asynchronous execution (`util.promisify(exec)` or `spawn`) when showing a loading spinner to ensure the animation continues.
