-- Dueno initial schema (Postgres 15+)
-- Apply: psql $DATABASE_URL -f server/schema/001_initial.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users (buyers, agents, admins) ─────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('buyer', 'agent', 'admin');
CREATE TYPE agent_status AS ENUM (
  'pending_review',
  'approved',
  'rejected',
  'suspended'
);
CREATE TYPE listing_type AS ENUM ('sale', 'rent');
CREATE TYPE listing_status AS ENUM (
  'draft',
  'pending_review',
  'approved',
  'rejected'
);
CREATE TYPE message_sender_role AS ENUM ('buyer', 'agent', 'admin');
CREATE TYPE upload_kind AS ENUM (
  'listing_gallery',
  'listing_floor_plan',
  'agent_avatar',
  'agent_id_document',
  'agent_cac_certificate',
  'other'
);
CREATE TYPE feedback_type AS ENUM ('general', 'issue', 'praise');

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  role          user_role NOT NULL,
  phone         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX users_role_idx ON users (role);
CREATE INDEX users_email_lower_idx ON users (LOWER(email));

-- ─── Agent profiles ───────────────────────────────────────────────────────────

CREATE TABLE agent_profiles (
  user_id           UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  agency_name       TEXT NOT NULL DEFAULT '',
  license_number    TEXT NOT NULL DEFAULT '',
  city              TEXT NOT NULL DEFAULT '',
  state             TEXT NOT NULL DEFAULT '',
  status            agent_status NOT NULL DEFAULT 'pending_review',
  created_by        TEXT NOT NULL DEFAULT 'self' CHECK (created_by IN ('admin', 'self')),
  notes             TEXT,
  trust_score       INTEGER CHECK (trust_score IS NULL OR trust_score BETWEEN 0 AND 100),
  bio               TEXT,
  avatar_url        TEXT,
  registration_json JSONB NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX agent_profiles_status_idx ON agent_profiles (status);

-- ─── Listings ─────────────────────────────────────────────────────────────────

CREATE TABLE listings (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               TEXT NOT NULL UNIQUE,
  agent_user_id      UUID NOT NULL REFERENCES users (id),
  title              TEXT NOT NULL,
  full_title         TEXT NOT NULL DEFAULT '',
  listing_type       listing_type NOT NULL,
  category           TEXT NOT NULL,
  status             listing_status NOT NULL DEFAULT 'pending_review',
  city               TEXT NOT NULL,
  state              TEXT NOT NULL,
  address            TEXT NOT NULL,
  map_address        TEXT NOT NULL DEFAULT '',
  price_display      TEXT NOT NULL,
  price_label        TEXT,
  price_ngn          BIGINT,
  beds               INTEGER NOT NULL DEFAULT 0,
  baths              INTEGER NOT NULL DEFAULT 0,
  sqft               TEXT NOT NULL DEFAULT '—',
  short_description  TEXT NOT NULL DEFAULT '',
  description        TEXT NOT NULL DEFAULT '',
  description_extra  TEXT NOT NULL DEFAULT '',
  highlights         JSONB NOT NULL DEFAULT '[]',
  features           JSONB NOT NULL DEFAULT '{}',
  amenities          JSONB NOT NULL DEFAULT '[]',
  floor_plans        JSONB NOT NULL DEFAULT '[]',
  faqs               JSONB NOT NULL DEFAULT '[]',
  owner_contact      JSONB NOT NULL DEFAULT '{}',
  nearby_landmarks   JSONB NOT NULL DEFAULT '[]',
  video_url          TEXT,
  cover_image_url    TEXT,
  agent_name         TEXT NOT NULL,
  agent_email        TEXT NOT NULL,
  agent_avatar_url   TEXT,
  created_by         TEXT NOT NULL DEFAULT 'agent' CHECK (created_by IN ('agent', 'admin')),
  submitted_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX listings_status_idx ON listings (status);
CREATE INDEX listings_type_idx ON listings (listing_type);
CREATE INDEX listings_agent_idx ON listings (agent_user_id);
CREATE INDEX listings_location_idx ON listings (city, state);
CREATE INDEX listings_published_idx ON listings (published_at DESC NULLS LAST);

-- ─── Listing images (normalized gallery; floor plans may also live in JSONB) ──

CREATE TABLE listing_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings (id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  file_name   TEXT NOT NULL DEFAULT '',
  kind        upload_kind NOT NULL DEFAULT 'listing_gallery',
  floor_plan_type TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX listing_images_listing_idx ON listing_images (listing_id, sort_order);

-- ─── Static catalog overrides (hide/edit built-in estateProperties.ts) ───────

CREATE TABLE static_listing_overrides (
  static_id   TEXT PRIMARY KEY,
  is_hidden   BOOLEAN NOT NULL DEFAULT FALSE,
  patch_json  JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Upload audit trail ───────────────────────────────────────────────────────

CREATE TABLE uploads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users (id) ON DELETE SET NULL,
  kind         upload_kind NOT NULL,
  storage_key  TEXT NOT NULL,
  public_url   TEXT NOT NULL,
  file_name    TEXT NOT NULL,
  mime_type    TEXT,
  byte_size    BIGINT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX uploads_user_idx ON uploads (user_id);

-- ─── Conversations & messages ─────────────────────────────────────────────────

CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     TEXT NOT NULL,
  property_title  TEXT NOT NULL,
  buyer_user_id   UUID REFERENCES users (id) ON DELETE SET NULL,
  buyer_name      TEXT NOT NULL,
  buyer_email     TEXT NOT NULL,
  agent_user_id   UUID NOT NULL REFERENCES users (id),
  agent_name      TEXT NOT NULL,
  subject         TEXT NOT NULL,
  unread_buyer    BOOLEAN NOT NULL DEFAULT FALSE,
  unread_agent    BOOLEAN NOT NULL DEFAULT TRUE,
  unread_admin    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX conversations_agent_idx ON conversations (agent_user_id, updated_at DESC);
CREATE INDEX conversations_buyer_idx ON conversations (buyer_user_id, updated_at DESC);

CREATE TABLE messages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
  sender_user_id   UUID REFERENCES users (id) ON DELETE SET NULL,
  sender_name      TEXT NOT NULL,
  sender_role      message_sender_role NOT NULL,
  body             TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX messages_conversation_idx ON messages (conversation_id, created_at);

-- ─── Reviews & engagement ─────────────────────────────────────────────────────

CREATE TABLE property_reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  TEXT NOT NULL,
  author_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  author_name  TEXT NOT NULL,
  author_email TEXT NOT NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title        TEXT NOT NULL DEFAULT '',
  body         TEXT NOT NULL,
  reactions    JSONB NOT NULL DEFAULT '{"helpful":[],"not_helpful":[],"love":[]}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX property_reviews_property_idx ON property_reviews (property_id, created_at DESC);

CREATE TABLE property_review_replies (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id    UUID NOT NULL REFERENCES property_reviews (id) ON DELETE CASCADE,
  author_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  author_name  TEXT NOT NULL,
  author_role  message_sender_role,
  rating       INTEGER CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  title        TEXT NOT NULL DEFAULT '',
  body         TEXT NOT NULL,
  reactions    JSONB NOT NULL DEFAULT '{"helpful":[],"not_helpful":[],"love":[]}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX property_review_replies_review_idx ON property_review_replies (review_id);

CREATE TABLE property_feedback (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id   TEXT NOT NULL,
  author_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  author_name   TEXT NOT NULL,
  author_email  TEXT NOT NULL,
  feedback_type feedback_type NOT NULL DEFAULT 'general',
  message       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE property_engagement (
  property_id    TEXT NOT NULL,
  visitor_key    TEXT NOT NULL,
  saved          BOOLEAN NOT NULL DEFAULT FALSE,
  bookmarked     BOOLEAN NOT NULL DEFAULT FALSE,
  visit_count    INTEGER NOT NULL DEFAULT 0,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (property_id, visitor_key)
);

-- ─── updated_at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER agent_profiles_updated_at
  BEFORE UPDATE ON agent_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
