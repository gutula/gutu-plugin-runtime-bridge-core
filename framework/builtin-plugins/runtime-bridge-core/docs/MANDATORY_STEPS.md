1. Register the runtime before accepting watched workspace or session state.
2. Refresh heartbeat and sync timestamps on every runtime or workspace mutation.
3. Keep provider and skill discovery as durable upserts rather than transient process memory.
4. Update session resume timestamps whenever an operator or automation resumes a runtime session.
