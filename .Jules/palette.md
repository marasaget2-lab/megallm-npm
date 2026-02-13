## 2024-05-22 - CLI UX Blocking Operations
**Learning:** Using synchronous `execSync` for system checks blocks the event loop, preventing spinners from animating smoothly.
**Action:** When adding spinners to CLI tools, verify if the underlying operations are async to ensure smooth animations. If synchronous, consider refactoring to async or accept the limitation that the spinner acts as a static "busy" indicator.
