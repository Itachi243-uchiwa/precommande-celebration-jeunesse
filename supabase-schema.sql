-- ================================================================
-- Schéma Supabase — Célébration Jeunesse Précommande
-- À coller dans : supabase.com → ton projet → SQL Editor → New query
-- ================================================================

CREATE TABLE IF NOT EXISTS orders (
  id            TEXT        PRIMARY KEY,
  nom           TEXT        NOT NULL,
  prenom        TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  telephone     TEXT        NOT NULL,
  items         JSONB       NOT NULL,
  total         NUMERIC(10,2) NOT NULL,
  statut        TEXT        NOT NULL DEFAULT 'en_attente'
                  CHECK (statut IN ('en_attente', 'payee', 'annulee')),
  date_commande TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour accélérer les recherches par statut et par date
CREATE INDEX IF NOT EXISTS idx_orders_statut        ON orders (statut);
CREATE INDEX IF NOT EXISTS idx_orders_date_commande ON orders (date_commande DESC);
