## 2025-02-23 - Micro-interactions for CLI Responsiveness
**Learning:** For CLIs, even synchronous operations that take < 500ms feel "stuck" without visual feedback. Replacing static `console.log` messages with `ora` spinners for "Detecting system..." and "Checking tools..." transforms the perception from "waiting" to "working".
**Action:** Default to using spinners for any operation that involves FS access or subprocess execution (like `execSync`), even if it seems fast on dev machines. Use `spinner.succeed()` to leave a clean trail of completed steps.
