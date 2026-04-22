import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const runtimeRegistrations = pgTable("runtime_registrations", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull(),
  transport: text("transport").notNull(),
  endpoint: text("endpoint"),
  ownerActorId: text("owner_actor_id").notNull(),
  profile: text("profile").notNull(),
  capabilityCount: integer("capability_count").notNull(),
  providerCount: integer("provider_count").notNull(),
  lastHeartbeatAt: timestamp("last_heartbeat_at").notNull().defaultNow()
});

export const watchedWorkspaces = pgTable("runtime_watched_workspaces", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  runtimeId: text("runtime_id").notNull(),
  repoRef: text("repo_ref").notNull(),
  host: text("host").notNull(),
  workspaceId: text("workspace_id"),
  workDir: text("work_dir"),
  status: text("status").notNull(),
  syncMode: text("sync_mode").notNull(),
  branchStrategy: text("branch_strategy").notNull(),
  policyStatus: text("policy_status").notNull(),
  policyNoteCount: integer("policy_note_count").notNull(),
  lastSyncedAt: timestamp("last_synced_at").notNull().defaultNow()
});

export const providerDetections = pgTable("runtime_provider_detections", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  runtimeId: text("runtime_id").notNull(),
  providerId: text("provider_id").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull(),
  detectedVersion: text("detected_version"),
  detectedAt: timestamp("detected_at").notNull().defaultNow()
});

export const localSkillSources = pgTable("runtime_local_skill_sources", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  runtimeId: text("runtime_id").notNull(),
  skillKey: text("skill_key").notNull(),
  label: text("label").notNull(),
  version: text("version").notNull(),
  status: text("status").notNull(),
  schemaRef: text("schema_ref").notNull(),
  importedSkillId: text("imported_skill_id"),
  lastSeenAt: timestamp("last_seen_at").notNull().defaultNow()
});

export const runtimeSessions = pgTable("runtime_sessions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  runtimeId: text("runtime_id").notNull(),
  workspaceId: text("workspace_id"),
  issueId: text("issue_id"),
  agentProfileId: text("agent_profile_id"),
  sessionId: text("session_id").notNull(),
  workDir: text("work_dir"),
  status: text("status").notNull(),
  checkpointId: text("checkpoint_id"),
  lastHeartbeatAt: timestamp("last_heartbeat_at").notNull().defaultNow(),
  lastResumedAt: timestamp("last_resumed_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
