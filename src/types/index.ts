// ─── Métiers BTP ────────────────────────────────────────────────────────────
export const METIERS_BTP = [
  { value: "plombier", label: "Plombier" },
  { value: "electricien", label: "Électricien" },
  { value: "macon", label: "Maçon" },
  { value: "charpentier", label: "Charpentier" },
  { value: "couvreur", label: "Couvreur" },
  { value: "peintre", label: "Peintre" },
  { value: "carreleur", label: "Carreleur" },
  { value: "menuisier", label: "Menuisier" },
  { value: "platrier", label: "Plâtrier / Plaquiste" },
  { value: "chauffagiste", label: "Chauffagiste" },
  { value: "climaticien", label: "Climaticien" },
  { value: "terrassier", label: "Terrassier" },
  { value: "paysagiste", label: "Paysagiste" },
  { value: "serrurier", label: "Serrurier / Métallier" },
  { value: "vitrier", label: "Vitrier" },
  { value: "isolation", label: "Isolation / ITE" },
  { value: "demolition", label: "Démolition" },
  { value: "general", label: "Entreprise générale" },
] as const;

export type MetierBTP = (typeof METIERS_BTP)[number]["value"];

// ─── Entreprise ──────────────────────────────────────────────────────────────
export interface Entreprise {
  id: string;
  siret: string;
  siren: string;
  nom_commercial: string | null;
  raison_sociale: string;
  metier: MetierBTP;
  adresse: string;
  code_postal: string;
  ville: string;
  departement: string;
  telephone: string | null;
  email: string | null;
  site_web: string | null;
  date_creation: string;
  effectif: string | null;
  statut_rcs: string | null;
  certifications_rge: CertificationRGE[];
  score_batiscore: number | null;
  nb_avis: number;
  score_indicatif: boolean;
  created_at: string;
  updated_at: string;
}

export interface CertificationRGE {
  organisme: string;
  code_qualification: string;
  libelle: string;
  date_debut: string;
  date_fin: string;
  meta_travaux: string;
  url: string | null;
}

// ─── Avis ────────────────────────────────────────────────────────────────────
export interface Avis {
  id: string;
  entreprise_id: string;
  auteur_prenom: string;
  auteur_email: string; // hashé côté serveur
  chantier_type: string;
  chantier_ville: string;
  chantier_annee: number;
  montant_estime: MontantEstime;
  // Critères de notation (1-5)
  note_delais: number;
  note_devis_respecte: number;
  note_qualite_finitions: number;
  note_qualite_conformite: number;
  note_communication: number;
  note_proprete: number;
  note_ponctualite: number;
  commentaire: string;
  avec_preuve: boolean;
  preuve_url: string | null;
  preuve_type: "facture" | "photo" | null;
  statut: "en_attente" | "valide" | "rejete";
  score_calcule: number | null;
  created_at: string;
}

export type MontantEstime =
  | "moins_1000"
  | "1000_5000"
  | "5000_15000"
  | "15000_50000"
  | "plus_50000";

// ─── Score BATISCORE ─────────────────────────────────────────────────────────
export interface DetailScore {
  fiabilite: number;   // 40% — délais + devis
  qualite: number;     // 40% — finitions + conformité
  professionnalisme: number; // 20% — communication + propreté + ponctualité
  total: number;       // /100
  nb_avis: number;
  indicatif: boolean;  // true si < 5 avis
}

// ─── Filtres annuaire ────────────────────────────────────────────────────────
export interface FiltresAnnuaire {
  ville: string;
  metier: MetierBTP | "";
  rge_seulement: boolean;
  note_min: number;
  page: number;
}

export interface ResultatRecherche {
  entreprises: EntrepriseCard[];
  total: number;
  page: number;
  par_page: number;
}

export interface EntrepriseCard
  extends Pick<
    Entreprise,
    | "id"
    | "siret"
    | "nom_commercial"
    | "raison_sociale"
    | "metier"
    | "ville"
    | "code_postal"
    | "score_batiscore"
    | "nb_avis"
    | "score_indicatif"
  > {
  certifie_rge: boolean;
}
