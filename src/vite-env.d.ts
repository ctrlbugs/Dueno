/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEWS_API_KEY?: string;
  readonly VITE_GNEWS_API_KEY?: string;
  readonly VITE_NEWSDATA_API_KEY?: string;
  readonly VITE_ENABLE_DEV_SEED_ACCOUNTS?: string;
  readonly VITE_DEV_ADMIN_EMAIL?: string;
  readonly VITE_DEV_ADMIN_PASSWORD?: string;
  readonly VITE_DEV_ADMIN_FIRST_NAME?: string;
  readonly VITE_DEV_ADMIN_LAST_NAME?: string;
  readonly VITE_DEV_ADMIN_TOKEN?: string;
  readonly VITE_DEV_AGENT_PENDING_EMAIL?: string;
  readonly VITE_DEV_AGENT_PENDING_PASSWORD?: string;
  readonly VITE_DEV_AGENT_APPROVED_EMAIL?: string;
  readonly VITE_DEV_AGENT_APPROVED_PASSWORD?: string;
  readonly VITE_DEV_BUYER_EMAIL?: string;
  readonly VITE_DEV_BUYER_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
