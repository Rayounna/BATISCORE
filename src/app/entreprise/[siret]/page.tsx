import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin, Phone, Mail, Globe, Calendar, ShieldCheck,
  Users, Building2, ArrowLeft, Star, FileCheck, AlertCircle,
} from "lucide-react";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { MetierBadge } from "@/components/ui/MetierBadge";
import { StarRating } from "@/components/ui/StarRating";
import { formatSiret } from "@/lib/utils";
import { couleurScore } from "@/lib/score";
import type { MetierBTP } from "@/types";

// Données mock — à remplacer par requête Supabase + API Entreprise
const getMockEntreprise = (siret: string) => ({
  id: "1",
  siret,
  siren: siret.slice(0, 9),
  nom_commercial: "Plomberie Martin & Fils",
  raison_sociale: "MARTIN ET FILS SARL",
  metier: "plombier" as MetierBTP,
  adresse: "12 rue des Artisans",
  code_postal: "69003",
  ville: "Lyon",
  departement: "069",
  telephone: "04 72 00 00 00",
  email: "contact@martin-plomberie.fr",
  site_web: "https://martin-plomberie.fr",
  date_creation: "2008-03-15",
  effectif: "6-9 salariés",
  statut_rcs: "Inscrit",
  score_batiscore: 87,
  score_fiabilite: 85,
  score_qualite: 90,
  score_pro: 82,
  nb_avis: 24,
  score_indicatif: false,
  certifications_rge: [],
  created_at: "2024-01-01",
  updated_at: "2025-03-01",
});

const MOCK_AVIS = [
  {
    id: "a1",
    auteur_prenom: "Sophie",
    chantier_type: "Remplacement chauffe-eau",
    chantier_ville: "Lyon",
    chantier_annee: 2024,
    montant_estime: "1000_5000" as const,
    note_delais: 5,
    note_devis_respecte: 4,
    note_qualite_finitions: 5,
    note_qualite_conformite: 5,
    note_communication: 4,
    note_proprete: 5,
    note_ponctualite: 5,
    commentaire: "Intervention rapide, travail soigné. Le plombier est arrivé à l'heure et a expliqué chaque étape. Je recommande vivement.",
    avec_preuve: true,
    preuve_type: "facture" as const,
    score_calcule: 92,
    created_at: "2024-11-10",
  },
  {
    id: "a2",
    auteur_prenom: "Jean-Pierre",
    chantier_type: "Rénovation salle de bain",
    chantier_ville: "Lyon",
    chantier_annee: 2024,
    montant_estime: "5000_15000" as const,
    note_delais: 4,
    note_devis_respecte: 4,
    note_qualite_finitions: 4,
    note_qualite_conformite: 4,
    note_communication: 5,
    note_proprete: 4,
    note_ponctualite: 4,
    commentaire: "Bon travail dans l'ensemble. Quelques finitions à revoir mais l'équipe a été réactive et a corrigé rapidement. Devis respecté.",
    avec_preuve: false,
    preuve_type: null,
    score_calcule: 82,
    created_at: "2024-09-22",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ siret: string }>;
}): Promise<Metadata> {
  const { siret } = await params;
  const e = getMockEntreprise(siret);
  return {
    title: `${e.nom_commercial ?? e.raison_sociale} — Score ${e.score_batiscore}/100`,
    description: `Fiche BATISCORE de ${e.nom_commercial ?? e.raison_sociale}. Score de fiabilité ${e.score_batiscore}/100 basé sur ${e.nb_avis} avis vérifiés. ${e.ville} (${e.code_postal}).`,
  };
}

export default async function FicheEntreprisePage({
  params,
}: {
  params: Promise<{ siret: string }>;
}) {
  const { siret } = await params;
  const e = getMockEntreprise(siret);

  const scoreCategories = [
    { label: "Fiabilité", score: e.score_fiabilite, pct: 40, desc: "Délais + devis respecté" },
    { label: "Qualité", score: e.score_qualite, pct: 40, desc: "Finitions + conformité" },
    { label: "Professionnalisme", score: e.score_pro, pct: 20, desc: "Communication + propreté + ponctualité" },
  ];

  return (
    <div className="min-h-screen bg-batiscore-cream">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-batiscore-navy transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/annuaire" className="hover:text-batiscore-navy transition-colors">Annuaire</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">
            {e.nom_commercial ?? e.raison_sociale}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* ─── Carte principale ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Score */}
            <div className="shrink-0">
              <ScoreBadge
                score={e.score_batiscore}
                indicatif={e.score_indicatif}
                size="lg"
                showLabel
              />
              {e.score_indicatif && (
                <p className="text-xs text-amber-600 text-center mt-2 max-w-[96px]">
                  Score indicatif (&lt;5 avis)
                </p>
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <MetierBadge metier={e.metier} />
                {e.certifications_rge.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Certifié RGE
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-batiscore-navy mb-1">
                {e.nom_commercial ?? e.raison_sociale}
              </h1>
              {e.nom_commercial && (
                <p className="text-gray-400 text-sm mb-3">{e.raison_sociale}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {e.adresse}, {e.code_postal} {e.ville}
                </span>
                {e.telephone && (
                  <a href={`tel:${e.telephone}`} className="flex items-center gap-1.5 hover:text-batiscore-orange transition-colors">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {e.telephone}
                  </a>
                )}
                {e.email && (
                  <a href={`mailto:${e.email}`} className="flex items-center gap-1.5 hover:text-batiscore-orange transition-colors">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {e.email}
                  </a>
                )}
                {e.site_web && (
                  <a href={e.site_web} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-batiscore-orange transition-colors">
                    <Globe className="w-4 h-4 text-gray-400" />
                    Site web
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-gray-300" />
                  SIRET : {formatSiret(e.siret)}
                </span>
                {e.date_creation && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-300" />
                    Créée en {new Date(e.date_creation).getFullYear()}
                  </span>
                )}
                {e.effectif && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-300" />
                    {e.effectif}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0 w-full sm:w-auto">
              <Link
                href={`/avis/nouveau?siret=${e.siret}`}
                className="flex items-center justify-center gap-2 bg-batiscore-orange hover:bg-batiscore-orange-dark text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm w-full"
              >
                <Star className="w-4 h-4" />
                Laisser un avis
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* ─── Détail du score ─────────────────────────────────────── */}
          <div className="md:col-span-1 bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-batiscore-navy mb-4">
              Détail du score
            </h2>
            <div className="space-y-4">
              {scoreCategories.map((c) => (
                <div key={c.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">{c.label}</span>
                      <span className="text-xs text-gray-400 ml-1.5">({c.pct}%)</span>
                    </div>
                    <span className={`text-sm font-bold ${couleurScore(c.score)}`}>
                      {c.score}/100
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${c.score >= 80 ? "bg-green-500" : c.score >= 60 ? "bg-yellow-400" : c.score >= 40 ? "bg-orange-400" : "bg-red-500"}`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>{e.nb_avis} avis pris en compte</span>
              {e.score_indicatif && (
                <span className="flex items-center gap-1 text-amber-500">
                  <AlertCircle className="w-3 h-3" />
                  Indicatif
                </span>
              )}
            </div>
          </div>

          {/* ─── Informations légales ────────────────────────────────── */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-batiscore-navy mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Informations officielles
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {[
                { label: "SIRET", val: formatSiret(e.siret) },
                { label: "SIREN", val: e.siren.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") },
                { label: "Raison sociale", val: e.raison_sociale },
                { label: "Date de création", val: e.date_creation ? new Date(e.date_creation).toLocaleDateString("fr-FR") : "—" },
                { label: "Effectif", val: e.effectif ?? "—" },
                { label: "Statut RCS", val: e.statut_rcs ?? "—" },
              ].map(({ label, val }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-gray-400 text-xs">{label}</span>
                  <span className="font-medium text-gray-800">{val}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-5 pt-4 border-t border-gray-100 flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Données issues de l&apos;API Entreprise (DINUM) — actualisées automatiquement.
            </p>
          </div>
        </div>

        {/* ─── Avis clients ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-batiscore-navy text-lg">
              Avis clients ({e.nb_avis})
            </h2>
            <Link
              href={`/avis/nouveau?siret=${e.siret}`}
              className="text-sm font-semibold text-batiscore-orange hover:underline"
            >
              + Ajouter un avis
            </Link>
          </div>

          <div className="space-y-5">
            {MOCK_AVIS.map((avis) => (
              <div
                key={avis.id}
                className="border border-gray-100 rounded-xl p-5 bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">
                        {avis.auteur_prenom}
                      </span>
                      <span className="text-gray-400 text-xs">·</span>
                      <span className="text-gray-500 text-sm">
                        {avis.chantier_type}
                      </span>
                      <span className="text-gray-400 text-xs">·</span>
                      <span className="text-gray-500 text-sm">
                        {avis.chantier_ville} ({avis.chantier_annee})
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <StarRating value={Math.round(avis.score_calcule! / 20)} readonly size="sm" />
                      <span className={`text-sm font-bold ${couleurScore(avis.score_calcule!)}`}>
                        {avis.score_calcule}/100
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {avis.avec_preuve && (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        <FileCheck className="w-3 h-3" />
                        {avis.preuve_type === "facture" ? "Facture" : "Photo"}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(avis.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {avis.commentaire}
                </p>

                {/* Notes détaillées */}
                <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: "Délais", val: avis.note_delais },
                    { label: "Devis respecté", val: avis.note_devis_respecte },
                    { label: "Finitions", val: avis.note_qualite_finitions },
                    { label: "Conformité", val: avis.note_qualite_conformite },
                    { label: "Communication", val: avis.note_communication },
                    { label: "Propreté", val: avis.note_proprete },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 w-24 shrink-0">{label}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <div key={s} className={`w-2 h-2 rounded-full ${s <= val ? "bg-amber-400" : "bg-gray-200"}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/annuaire"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-batiscore-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;annuaire
        </Link>
      </div>
    </div>
  );
}
