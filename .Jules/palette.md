## 2024-05-23 - [Blocking Spinners]
**Learning:** Blocking synchronous operations (like `execSync`) freeze UI spinners (`ora`), making the app feel unresponsive. Always use async operations for long-running tasks to keep the event loop alive for UI updates.
**Action:** Use `promisify(exec)` or `spawn` instead of `execSync` for long-running shell commands when using a spinner.
