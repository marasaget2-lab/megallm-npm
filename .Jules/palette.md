## 2025-02-20 - [Spinner Feedback]
**Learning:** Synchronous tasks with `ora` spinners don't animate but still provide better visual structure (checkmarks) than raw console logs.
**Action:** Use `ora` for all "step-based" CLI actions to maintain visual consistency, even if the action is instant.
