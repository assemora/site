-- 0001_initial
-- Written by `assemora db:generate`. A comment beginning `-- +` is read back by
-- `assemora db:migrate`; every other comment in this file is for you.

-- +migration up

create table "assemora_agent_tokens" (
  "id" uuid primary key,
  "agent_id" uuid not null,
  "name" varchar(255) not null,
  "token_hash" varchar(255) not null unique,
  "expires_at" timestamptz,
  "last_used_at" timestamptz,
  "created_at" timestamptz not null
);

create table "assemora_agents" (
  "id" uuid primary key,
  "name" varchar(255) not null unique,
  "description" text,
  "permissions" jsonb not null,
  "enabled" boolean not null,
  "created_at" timestamptz not null
);

create table "assemora_api_tokens" (
  "id" uuid primary key,
  "name" varchar(255) not null,
  "token_hash" varchar(255) not null unique,
  "user_id" uuid,
  "permissions" jsonb not null,
  "expires_at" timestamptz,
  "last_used_at" timestamptz,
  "created_at" timestamptz not null
);

create table "assemora_audit_logs" (
  "id" uuid primary key,
  "actor_type" varchar(255),
  "actor_id" varchar(255),
  "source" varchar(255) not null,
  "action" varchar(255) not null,
  "kind" varchar(255) not null,
  "entity_type" varchar(255),
  "entity_id" varchar(255),
  "request_id" varchar(255) not null,
  "metadata" jsonb not null,
  "created_at" timestamptz not null
);

create table "assemora_change_sets" (
  "id" uuid primary key,
  "actor_type" varchar(255),
  "actor_id" varchar(255),
  "title" varchar(255) not null,
  "commands" jsonb not null,
  "diff" jsonb not null,
  "status" varchar(255) not null,
  "base_versions" jsonb not null,
  "expires_at" timestamptz not null,
  "created_at" timestamptz not null,
  "applied_at" timestamptz
);

create table "assemora_media" (
  "id" uuid primary key,
  "disk" varchar(255) not null,
  "path" varchar(255) not null,
  "filename" varchar(255) not null,
  "mime_type" varchar(255) not null,
  "size" integer not null,
  "width" integer,
  "height" integer,
  "alt" varchar(255),
  "metadata" jsonb not null,
  "created_by" uuid,
  "created_at" timestamptz not null
);

create table "assemora_pages" (
  "id" uuid primary key,
  "slug" varchar(255) not null,
  "title" varchar(255) not null,
  "status" text not null check ("status" in ('draft', 'published', 'archived')),
  "draft_tree" jsonb not null,
  "published_tree" jsonb,
  "meta" jsonb not null,
  "version" integer not null,
  "created_by" uuid,
  "updated_by" uuid,
  "published_at" timestamptz,
  "created_at" timestamptz not null,
  "updated_at" timestamptz not null,
  "locale" varchar(255) not null,
  "translation_of" uuid,
  unique ("slug", "locale")
);

create table "assemora_permissions" (
  "id" uuid primary key,
  "name" varchar(255) not null unique,
  "description" text
);

create table "assemora_resource_definitions" (
  "id" uuid primary key,
  "name" varchar(255) not null unique,
  "label" varchar(255) not null,
  "schema" jsonb not null,
  "settings" jsonb not null,
  "created_at" timestamptz not null,
  "updated_at" timestamptz not null
);

create table "assemora_resource_entries" (
  "id" uuid primary key,
  "resource_id" uuid not null,
  "data" jsonb not null,
  "status" text not null check ("status" in ('draft', 'published', 'archived')),
  "version" integer not null,
  "created_by" uuid,
  "updated_by" uuid,
  "created_at" timestamptz not null,
  "updated_at" timestamptz not null,
  "deleted_at" timestamptz,
  "published_at" timestamptz
);

create table "assemora_resource_layouts" (
  "id" uuid primary key,
  "resource" varchar(255) not null unique,
  "layout" jsonb not null,
  "version" integer not null,
  "updated_by" uuid,
  "created_at" timestamptz not null,
  "updated_at" timestamptz not null
);

create table "assemora_revisions" (
  "id" uuid primary key,
  "entity_type" varchar(255) not null,
  "entity_id" varchar(255) not null,
  "sequence" integer not null,
  "actor_type" varchar(255),
  "actor_id" varchar(255),
  "command" varchar(255) not null,
  "before" jsonb,
  "after" jsonb,
  "patch" jsonb not null,
  "request_id" varchar(255) not null,
  "metadata" jsonb not null,
  "created_at" timestamptz not null
);

create table "assemora_role_permissions" (
  "id" uuid primary key,
  "role_id" uuid not null,
  "permission_id" uuid not null
);

create table "assemora_roles" (
  "id" uuid primary key,
  "name" varchar(255) not null unique,
  "label" varchar(255) not null,
  "version" integer not null,
  "created_at" timestamptz not null
);

create table "assemora_sessions" (
  "id" uuid primary key,
  "token_hash" varchar(255) not null unique,
  "user_id" uuid not null,
  "user_agent" varchar(255),
  "ip_address" varchar(255),
  "expires_at" timestamptz not null,
  "created_at" timestamptz not null
);

create table "assemora_singletons" (
  "id" uuid primary key,
  "name" varchar(255) not null unique,
  "values" jsonb not null,
  "version" integer not null,
  "updated_by" uuid,
  "created_at" timestamptz not null,
  "updated_at" timestamptz not null
);

create table "assemora_theme" (
  "id" varchar(255) primary key,
  "tokens" jsonb not null,
  "version" integer not null,
  "updated_by" uuid,
  "created_at" timestamptz not null,
  "updated_at" timestamptz not null
);

create table "assemora_user_roles" (
  "id" uuid primary key,
  "user_id" uuid not null,
  "role_id" uuid not null
);

create table "assemora_users" (
  "id" uuid primary key,
  "email" varchar(255) not null unique,
  "name" varchar(255) not null,
  "password_hash" varchar(255) not null,
  "active" boolean not null,
  "version" integer not null,
  "created_at" timestamptz not null,
  "updated_at" timestamptz not null
);

create index "assemora_audit_logs_actor_type_idx" on "assemora_audit_logs" ("actor_type");

create index "assemora_audit_logs_actor_id_idx" on "assemora_audit_logs" ("actor_id");

create index "assemora_audit_logs_source_idx" on "assemora_audit_logs" ("source");

create index "assemora_audit_logs_action_idx" on "assemora_audit_logs" ("action");

create index "assemora_audit_logs_kind_idx" on "assemora_audit_logs" ("kind");

create index "assemora_audit_logs_entity_type_idx" on "assemora_audit_logs" ("entity_type");

create index "assemora_audit_logs_request_id_idx" on "assemora_audit_logs" ("request_id");

create index "assemora_audit_logs_created_at_idx" on "assemora_audit_logs" ("created_at");

create index "assemora_change_sets_actor_id_idx" on "assemora_change_sets" ("actor_id");

create index "assemora_change_sets_status_idx" on "assemora_change_sets" ("status");

create index "assemora_change_sets_created_at_idx" on "assemora_change_sets" ("created_at");

create index "assemora_pages_locale_idx" on "assemora_pages" ("locale");

create index "assemora_pages_translation_of_idx" on "assemora_pages" ("translation_of");

create index "assemora_revisions_entity_type_idx" on "assemora_revisions" ("entity_type");

create index "assemora_revisions_entity_id_idx" on "assemora_revisions" ("entity_id");

create index "assemora_revisions_sequence_idx" on "assemora_revisions" ("sequence");

create index "assemora_revisions_created_at_idx" on "assemora_revisions" ("created_at");


-- +migration down

drop index "assemora_audit_logs_actor_type_idx";

drop index "assemora_audit_logs_actor_id_idx";

drop index "assemora_audit_logs_source_idx";

drop index "assemora_audit_logs_action_idx";

drop index "assemora_audit_logs_kind_idx";

drop index "assemora_audit_logs_entity_type_idx";

drop index "assemora_audit_logs_request_id_idx";

drop index "assemora_audit_logs_created_at_idx";

drop index "assemora_change_sets_actor_id_idx";

drop index "assemora_change_sets_status_idx";

drop index "assemora_change_sets_created_at_idx";

drop index "assemora_pages_locale_idx";

drop index "assemora_pages_translation_of_idx";

drop index "assemora_revisions_entity_type_idx";

drop index "assemora_revisions_entity_id_idx";

drop index "assemora_revisions_sequence_idx";

drop index "assemora_revisions_created_at_idx";

drop table "assemora_agent_tokens";

drop table "assemora_agents";

drop table "assemora_api_tokens";

drop table "assemora_audit_logs";

drop table "assemora_change_sets";

drop table "assemora_media";

drop table "assemora_pages";

drop table "assemora_permissions";

drop table "assemora_resource_definitions";

drop table "assemora_resource_entries";

drop table "assemora_resource_layouts";

drop table "assemora_revisions";

drop table "assemora_role_permissions";

drop table "assemora_roles";

drop table "assemora_sessions";

drop table "assemora_singletons";

drop table "assemora_theme";

drop table "assemora_user_roles";

drop table "assemora_users";
