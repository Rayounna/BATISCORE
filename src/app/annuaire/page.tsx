import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal, ShieldCheck, MapPin } from "lucide-react";
import { METIERS_BTP, type MetierBTP } from "@/types";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { MetierBadge } from "@/components/ui/MetierBadge";
import { formatVille } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Annuaire des artisans BTP",
  description:
    "Cherchez un plombier, électricien, maçon ou tout autre artisan BTP près de chez vous. Score de fiabilité, avis vérifiés, certifications RGE.",
};

// Données mock — à remplacer par une vraie requête Supabase
const MOCK_ENTREPRISES = [
  { id: "1", siret: "12345678901234", nom_commercial: "Plomberie Martin & Fils", raison_sociale: "MARTIN ET FILS SARL", metier: "plombier" as MetierBTP, ville: "Lyon", code_postal: "69003", score_batiscore: 87, nb_avis: 24, score_indicatif: false, certifie_rge: false },
  { id: "2", siret: "23456789012345", nom_commercial: "Électricité Dubois", raison_sociale: "DUBOIS ELECTRICITE", metier: "electricien" as MetierBTP, ville: "Paris", code_postal: "75011", score_batiscore: 73, nb_avis: 11, score_indicatif: false, certifie_rge: true },
  { id: "3", siret: "34567890123456", nom_commercial: "Isolation & Réno Sud", raison_sociale: "RENO SUD SAS", metier: "isolation" as MetierBTP, ville: "Marseille", code_postal: "13008", score_batiscore: 91, nb_avis: 38, score_indicatif: false, certifie_rge: true },
  { id: "4", siret: "45678901234567", nom_commercial: null, raison_sociale: "DUPONT MACONNERIE", metier: "macon" as MetierBTP, ville: "Bordeaux", code_postal: "33000", score_batiscore: 62, nb_avis: 7, score_indicatif: false, certifie_rge: false },
  { id: "5", siret: "56789012345678", nom_commercial: "Toiture Bertrand", raison_sociale: "BERTRAND COUVERTURE", metier: "couvreur" as MetierBTP, ville: "Nantes", code_postal: "44000", score_batiscore: 55, nb_avis: 3, score_indicatif: true, certifie_rge: false },
  { id: "6", siret: "67890123456789", nom_commercial: "Chauffage Eco+", raison_sociale: "ECO PLUS CHAUFFAGE SAS", metier: "chauffagiste" as MetierBTP, ville: "Toulouse", code_postal: "31000", score_batiscore: 84, nb_avis: 19, score_indicatif: false, certifie_rge: true },
];

interface SearchParams {
  ville?: string;
  metier?: string;
  rge?: string;
  note_min?: string;
  page?: string;
}

export default async function AnnuairePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const ville = params.ville ?? "";
  const metier = (params.metier ?? "") as MetierBTP | "";
  const rgeOnly = params.rge === "1";
  const noteMin = parseInt(params.note_min ?? "0", 10);

  // Filtrage mock
  let resultats = MOCK_ENTREPRISES.filter((e) => {
    if (ville && !e.ville.toLowerCase().includes(ville.toLowerCase())) return false;
    if (metier && e.metier !== metier) return false;
    if (rgeOnly && !e.certifie_rge) return false;
    if (noteMin && (e.score_batiscore ?? 0) < noteMin) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-batiscore-cream">
      {/* ─── Barre de recherche ─────────────────────────────────────── */}
      <div className="bg-batiscore-navy py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-5">
            {ville
              ? `Artisans BTP à ${formatVille(ville)}`
              : "Annuaire des artisans BTP"}
          </h1>
          <form method="GET" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="ville"
                defaultValue={ville}
                placeholder="Ville ou code postal"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-batiscore-orange"
              />
            </div>
            <div className="relative sm:w-48">
              <select
                name="metier"
                defaultValue={metier}
                className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-batiscore-orange appearance-none"
              >
                <option value="">Tous les métiers</option>
                {METIERS_BTP.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-batiscore-orange hover:bg-batiscore-orange-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Search className="w-4 h-4" />
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {/* ─── Contenu ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Filtres sidebar ──────────────────────────────────────── */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center gap-2 font-semibold text-batiscore-navy mb-4">
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </div>

              <form method="GET" className="space-y-5">
                <input type="hidden" name="ville" value={ville} />
                <input type="hidden" name="metier" value={metier} />

                {/* Certification RGE */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rge"
                      value="1"
                      defaultChecked={rgeOnly}
                      className="w-4 h-4 accent-batiscore-orange rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      Certifié RGE uniquement
                    </span>
                  </label>
                </div>

                {/* Score minimum */}
                <div>
                  <label className="label">Score minimum</label>
                  <select
                    name="note_min"
                    defaultValue={noteMin}
                    className="input-field text-sm"
                  >
                    <option value="0">Tous les scores</option>
                    <option value="40">40+ (Passable)</option>
                    <option value="60">60+ (Bien)</option>
                    <option value="70">70+ (Très bien)</option>
                    <option value="85">85+ (Excellent)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-batiscore-navy text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-batiscore-navy-light transition-colors"
                >
                  Appliquer les filtres
                </button>
              </form>
            </div>
          </aside>

          {/* ── Résultats ─────────────────────────────────────────────── */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{resultats.length}</span>{" "}
                entreprise{resultats.length !== 1 ? "s" : ""} trouvée
                {resultats.length !== 1 ? "s" : ""}
              </p>
            </div>

            {resultats.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-semibold text-batiscore-navy text-lg mb-2">
                  Aucun résultat
                </h3>
                <p className="text-gray-500 text-sm">
                  Essayez d&apos;élargir votre recherche ou de modifier les filtres.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {resultats.map((e) => (
                  <Link
                    key={e.id}
                    href={`/entreprise/${e.siret}`}
                    className="block bg-white rounded-2xl border border-gray-200 p-5 hover:border-batiscore-orange hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-5">
                      <ScoreBadge
                        score={e.score_batiscore}
                        indicatif={e.score_indicatif}
                        size="md"
                        showLabel
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="font-bold text-batiscore-navy text-lg group-hover:text-batiscore-orange transition-colors">
                              {e.nom_commercial ?? e.raison_sociale}
                            </h2>
                            {e.nom_commercial && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {e.raison_sociale}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <MetierBadge metier={e.metier} />
                            {e.certifie_rge && (
                              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                <ShieldCheck className="w-3 h-3" />
                                RGE
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {e.ville} ({e.code_postal})
                          </span>
                          <span>·</span>
                          <span>
                            {e.nb_avis} avis
                            {e.score_indicatif && (
                              <span className="ml-1 text-amber-500 text-xs font-medium">
                                (indicatif)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
