# Palette's Journal

## 2025-02-23 - Spinner Feedback
**Learning:** Adding spinners to synchronous checks (like `execSync` for tool detection) can cause flicker if the check is too fast, but provides necessary feedback when it's slow (e.g., on Windows or slow disks).
**Action:** Consider wrapping synchronous checks in a promise with a minimum duration if flicker becomes an issue, or just accept it as "activity indicator".
