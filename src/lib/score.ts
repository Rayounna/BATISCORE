import type { Avis, DetailScore } from "@/types";

/**
 * Calcule le score BATISCORE d'un avis individuel sur 100.
 * Pondération :
 *   Fiabilité       40% → délais (50%) + devis respecté (50%)
 *   Qualité         40% → finitions (50%) + conformité (50%)
 *   Professionnalisme 20% → communication (33%) + propreté (33%) + ponctualité (33%)
 *
 * Avis avec preuve (facture/photo) → coefficient x1.5 dans la moyenne globale.
 */
export function calculerScoreAvis(avis: Avis): number {
  const fiabilite =
    ((avis.note_delais + avis.note_devis_respecte) / 2 / 5) * 100;
  const qualite =
    ((avis.note_qualite_finitions + avis.note_qualite_conformite) / 2 / 5) *
    100;
  const pro =
    ((avis.note_communication + avis.note_proprete + avis.note_ponctualite) /
      3 /
      5) *
    100;

  return Math.round(fiabilite * 0.4 + qualite * 0.4 + pro * 0.2);
}

/**
 * Calcule le score global BATISCORE d'une entreprise à partir de ses avis.
 */
export function calculerScoreEntreprise(avis: Avis[]): DetailScore {
  const avisValides = avis.filter((a) => a.statut === "valide");

  if (avisValides.length === 0) {
    return {
      fiabilite: 0,
      qualite: 0,
      professionnalisme: 0,
      total: 0,
      nb_avis: 0,
      indicatif: true,
    };
  }

  let totalFiabilite = 0;
  let totalQualite = 0;
  let totalPro = 0;
  let poidsTotal = 0;

  for (const a of avisValides) {
    const poids = a.avec_preuve ? 1.5 : 1;
    totalFiabilite +=
      ((a.note_delais + a.note_devis_respecte) / 2 / 5) * 100 * poids;
    totalQualite +=
      ((a.note_qualite_finitions + a.note_qualite_conformite) / 2 / 5) *
      100 *
      poids;
    totalPro +=
      ((a.note_communication + a.note_proprete + a.note_ponctualite) /
        3 /
        5) *
      100 *
      poids;
    poidsTotal += poids;
  }

  const fiabilite = Math.round(totalFiabilite / poidsTotal);
  const qualite = Math.round(totalQualite / poidsTotal);
  const professionnalisme = Math.round(totalPro / poidsTotal);
  const total = Math.round(
    fiabilite * 0.4 + qualite * 0.4 + professionnalisme * 0.2
  );

  return {
    fiabilite,
    qualite,
    professionnalisme,
    total,
    nb_avis: avisValides.length,
    indicatif: avisValides.length < 5,
  };
}

/**
 * Retourne la couleur associée à un score.
 */
export function couleurScore(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

export function couleurScoreBg(score: number): string {
  if (score >= 80) return "bg-green-50 border-green-200";
  if (score >= 60) return "bg-yellow-50 border-yellow-200";
  if (score >= 40) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

export function libelleScore(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Très bien";
  if (score >= 55) return "Bien";
  if (score >= 40) return "Passable";
  return "Insuffisant";
}
