## 2025-02-18 - Async CLI Interactions
**Learning:** Using `execSync` for long-running operations (like `npm install`) blocks the Node.js event loop, causing spinners (like `ora`) and other UI animations to freeze, which creates a perception that the process has hung.
**Action:** Always use `util.promisify(exec)` or `child_process.spawn` for long-running CLI tasks to keep the UI responsive and provide visual feedback.
