-- New 'editor' role: content-publishing access without full admin
-- privileges (messages, memberships, analytics, logs, settings, and
-- user/role management stay admin-only).
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
