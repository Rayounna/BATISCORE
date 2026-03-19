-- ============================================================
-- BATISCORE — Schéma Supabase
-- ============================================================

-- Extension pour UUID
create extension if not exists "uuid-ossp";

-- ─── Enum : métiers BTP ─────────────────────────────────────
create type metier_btp as enum (
  'plombier', 'electricien', 'macon', 'charpentier', 'couvreur',
  'peintre', 'carreleur', 'menuisier', 'platrier', 'chauffagiste',
  'climaticien', 'terrassier', 'paysagiste', 'serrurier',
  'vitrier', 'isolation', 'demolition', 'general'
);

-- ─── Enum : statut avis ──────────────────────────────────────
create type statut_avis as enum ('en_attente', 'valide', 'rejete');

-- ─── Enum : montant estimé ───────────────────────────────────
create type montant_estime as enum (
  'moins_1000', '1000_5000', '5000_15000', '15000_50000', 'plus_50000'
);

-- ─── Table : entreprises ─────────────────────────────────────
create table entreprises (
  id                uuid primary key default uuid_generate_v4(),
  siret             char(14) not null unique,
  siren             char(9) not null,
  nom_commercial    text,
  raison_sociale    text not null,
  metier            metier_btp not null,
  adresse           text not null,
  code_postal       char(5) not null,
  ville             text not null,
  departement       char(3) not null,
  telephone         text,
  email             text,
  site_web          text,
  date_creation     date,
  effectif          text,
  statut_rcs        text,
  -- Score calculé (mis à jour par trigger)
  score_batiscore   integer check (score_batiscore between 0 and 100),
  score_fiabilite   integer check (score_fiabilite between 0 and 100),
  score_qualite     integer check (score_qualite between 0 and 100),
  score_pro         integer check (score_pro between 0 and 100),
  nb_avis           integer not null default 0,
  score_indicatif   boolean not null default true,
  -- Données API RGE ADEME (JSON)
  certifications_rge jsonb default '[]'::jsonb,
  -- Données API Entreprise brutes
  api_entreprise_data jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_entreprises_ville on entreprises (lower(ville));
create index idx_entreprises_metier on entreprises (metier);
create index idx_entreprises_code_postal on entreprises (code_postal);
create index idx_entreprises_score on entreprises (score_batiscore desc nulls last);

-- ─── Table : avis ────────────────────────────────────────────
create table avis (
  id                  uuid primary key default uuid_generate_v4(),
  entreprise_id       uuid not null references entreprises(id) on delete cascade,
  auteur_prenom       text not null,
  auteur_email_hash   text not null, -- sha256 de l'email
  chantier_type       text not null,
  chantier_ville      text not null,
  chantier_annee      smallint not null check (chantier_annee between 2000 and 2030),
  montant_estime      montant_estime not null,
  -- Notes /5
  note_delais             smallint not null check (note_delais between 1 and 5),
  note_devis_respecte     smallint not null check (note_devis_respecte between 1 and 5),
  note_qualite_finitions  smallint not null check (note_qualite_finitions between 1 and 5),
  note_qualite_conformite smallint not null check (note_qualite_conformite between 1 and 5),
  note_communication      smallint not null check (note_communication between 1 and 5),
  note_proprete           smallint not null check (note_proprete between 1 and 5),
  note_ponctualite        smallint not null check (note_ponctualite between 1 and 5),
  commentaire         text not null check (length(commentaire) between 50 and 2000),
  avec_preuve         boolean not null default false,
  preuve_url          text,
  preuve_type         text check (preuve_type in ('facture', 'photo')),
  statut              statut_avis not null default 'en_attente',
  score_calcule       integer check (score_calcule between 0 and 100),
  created_at          timestamptz not null default now()
);

create index idx_avis_entreprise on avis (entreprise_id);
create index idx_avis_statut on avis (statut);

-- ─── Trigger : recalcul du score après validation d'un avis ──
create or replace function recalculer_score_entreprise()
returns trigger language plpgsql as $$
declare
  v_count integer;
  v_fiabilite numeric;
  v_qualite numeric;
  v_pro numeric;
  v_total numeric;
  v_poids_total numeric;
  rec record;
begin
  -- Sélection de l'entreprise concernée
  if (TG_OP = 'DELETE') then
    perform recalc_for_entreprise(OLD.entreprise_id);
  else
    perform recalc_for_entreprise(NEW.entreprise_id);
  end if;
  return NEW;
end;
$$;

create or replace function recalc_for_entreprise(p_entreprise_id uuid)
returns void language plpgsql as $$
declare
  v_count integer := 0;
  v_fiabilite numeric := 0;
  v_qualite numeric := 0;
  v_pro numeric := 0;
  v_poids_total numeric := 0;
  rec record;
begin
  for rec in
    select * from avis where entreprise_id = p_entreprise_id and statut = 'valide'
  loop
    declare poids numeric := case when rec.avec_preuve then 1.5 else 1 end;
    begin
      v_fiabilite := v_fiabilite + ((rec.note_delais + rec.note_devis_respecte) / 2.0 / 5.0) * 100 * poids;
      v_qualite := v_qualite + ((rec.note_qualite_finitions + rec.note_qualite_conformite) / 2.0 / 5.0) * 100 * poids;
      v_pro := v_pro + ((rec.note_communication + rec.note_proprete + rec.note_ponctualite) / 3.0 / 5.0) * 100 * poids;
      v_poids_total := v_poids_total + poids;
      v_count := v_count + 1;
    end;
  end loop;

  if v_count = 0 then
    update entreprises set
      score_batiscore = null,
      score_fiabilite = null,
      score_qualite = null,
      score_pro = null,
      nb_avis = 0,
      score_indicatif = true,
      updated_at = now()
    where id = p_entreprise_id;
  else
    update entreprises set
      score_fiabilite = round(v_fiabilite / v_poids_total),
      score_qualite = round(v_qualite / v_poids_total),
      score_pro = round(v_pro / v_poids_total),
      score_batiscore = round((v_fiabilite / v_poids_total) * 0.4 + (v_qualite / v_poids_total) * 0.4 + (v_pro / v_poids_total) * 0.2),
      nb_avis = v_count,
      score_indicatif = (v_count < 5),
      updated_at = now()
    where id = p_entreprise_id;
  end if;
end;
$$;

create trigger trg_recalc_score
after insert or update of statut or delete on avis
for each row execute function recalculer_score_entreprise();

-- ─── RLS Policies ────────────────────────────────────────────
alter table entreprises enable row level security;
alter table avis enable row level security;

-- Tout le monde peut lire les entreprises
create policy "entreprises_public_read" on entreprises
  for select using (true);

-- Tout le monde peut lire les avis validés
create policy "avis_public_read" on avis
  for select using (statut = 'valide');

-- Tout le monde peut soumettre un avis (en_attente)
create policy "avis_public_insert" on avis
  for insert with check (statut = 'en_attente');
