import Link from "next/link";
import { Search, ShieldCheck, Star, FileCheck, ArrowRight, HardHat } from "lucide-react";
import { METIERS_BTP } from "@/types";
import { ScoreBadge } from "@/components/ui/ScoreBadge";

// Données de démo pour l'aperçu de la page d'accueil
const DEMO_ENTREPRISES = [
  {
    id: "1",
    nom: "Plomberie Martin & Fils",
    metier: "Plombier",
    ville: "Lyon",
    score: 87,
    nb_avis: 24,
    certifie_rge: false,
    indicatif: false,
  },
  {
    id: "2",
    nom: "Électricité Dubois",
    metier: "Électricien",
    ville: "Paris 11e",
    score: 73,
    nb_avis: 11,
    certifie_rge: true,
    indicatif: false,
  },
  {
    id: "3",
    nom: "Isolation & Réno Sud",
    metier: "Isolation",
    ville: "Marseille",
    score: 91,
    nb_avis: 38,
    certifie_rge: true,
    indicatif: false,
  },
];

const ETAPES = [
  {
    num: "01",
    titre: "Cherchez par ville et métier",
    desc: "Entrez votre ville et le type d'artisan dont vous avez besoin. Nos données SIRET sont issues de l'API officielle du gouvernement.",
  },
  {
    num: "02",
    titre: "Consultez le score BATISCORE",
    desc: "Chaque entreprise a un score sur 100 basé sur la fiabilité (40%), la qualité (40%) et le professionnalisme (20%). Les avis avec preuve comptent x1,5.",
  },
  {
    num: "03",
    titre: "Laissez un avis après chantier",
    desc: "Partagez votre expérience en notant 7 critères précis. Joignez une facture ou photo pour renforcer la crédibilité de votre avis.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-batiscore-navy to-batiscore-navy-light text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-batiscore-orange/20 text-batiscore-orange-light border border-batiscore-orange/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <HardHat className="w-4 h-4" />
            La notation indépendante du BTP français
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Trouvez un artisan de{" "}
            <span className="text-batiscore-orange">confiance</span>{" "}
            près de chez vous
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            BATISCORE note la fiabilité des entreprises BTP grâce aux avis
            vérifiés de vrais clients. Données SIRET officielles, certifications
            RGE, zéro pub, zéro commission.
          </p>

          {/* Barre de recherche */}
          <form
            action="/annuaire"
            method="GET"
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          >
            <input
              type="text"
              name="ville"
              placeholder="Votre ville (ex : Lyon, Bordeaux...)"
              className="flex-1 px-5 py-4 rounded-xl text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-batiscore-orange text-base"
            />
            <select
              name="metier"
              className="sm:w-48 px-5 py-4 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-batiscore-orange text-base"
            >
              <option value="">Tous les métiers</option>
              {METIERS_BTP.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-batiscore-orange hover:bg-batiscore-orange-dark text-white font-bold px-8 py-4 rounded-xl transition-colors text-base"
            >
              <Search className="w-5 h-5" />
              Rechercher
            </button>
          </form>
          <p className="text-sm text-gray-400 mt-4">
            Plus de 500 000 entreprises BTP répertoriées en France
          </p>
        </div>
      </section>

      {/* ─── Statistiques ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { val: "500k+", label: "Entreprises" },
            { val: "12k+", label: "Avis vérifiés" },
            { val: "18", label: "Métiers BTP" },
            { val: "100%", label: "Gratuit" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-batiscore-navy">
                {stat.val}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Comment ça marche ─────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-batiscore-cream">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-batiscore-navy text-center mb-3">
            Comment fonctionne BATISCORE ?
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Une plateforme simple et transparente — aucune intermédiation, aucun devis, aucun paiement.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {ETAPES.map((e) => (
              <div
                key={e.num}
                className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm"
              >
                <div className="text-4xl font-black text-batiscore-orange/20 mb-3">
                  {e.num}
                </div>
                <h3 className="font-bold text-batiscore-navy text-lg mb-2">
                  {e.titre}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Score expliqué ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-batiscore-navy mb-4">
                Le score BATISCORE, c&apos;est quoi ?
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Un score sur 100 calculé à partir d&apos;avis structurés, pondérés par
                catégorie. Les avis accompagnés d&apos;une preuve (facture ou photo)
                ont un poids x1,5.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Fiabilité", pct: 40, color: "bg-blue-500", desc: "Délais respectés + devis respecté" },
                  { label: "Qualité", pct: 40, color: "bg-green-500", desc: "Finitions + conformité aux attentes" },
                  { label: "Professionnalisme", pct: 20, color: "bg-amber-500", desc: "Communication + propreté + ponctualité" },
                ].map((c) => (
                  <div key={c.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-gray-800 text-sm">
                        {c.label}
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        {c.pct}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div
                          className={`${c.color} h-3 rounded-full`}
                          style={{ width: `${c.pct}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Aperçu des scores */}
            <div className="space-y-4">
              {DEMO_ENTREPRISES.map((e) => (
                <div
                  key={e.id}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center gap-5"
                >
                  <ScoreBadge score={e.score} indicatif={e.indicatif} size="md" showLabel />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-batiscore-navy truncate">
                      {e.nom}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                      <span>{e.metier}</span>
                      <span>·</span>
                      <span>{e.ville}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= Math.round(e.score / 20) ? "text-amber-400" : "text-gray-200"}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {e.nb_avis} avis
                      </span>
                      {e.certifie_rge && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          RGE
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                </div>
              ))}
              <Link
                href="/annuaire"
                className="block text-center text-batiscore-orange font-semibold text-sm hover:underline mt-2"
              >
                Voir tous les artisans →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Garanties ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-batiscore-cream border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <FileCheck className="w-7 h-7 text-batiscore-orange" />,
                titre: "Données officielles",
                desc: "SIRET vérifié via l'API Entreprise du gouvernement. Certifications RGE issues de l'ADEME.",
              },
              {
                icon: <Star className="w-7 h-7 text-batiscore-orange" />,
                titre: "Avis structurés",
                desc: "7 critères précis par avis. Les preuves (facture, photo) augmentent le poids x1,5.",
              },
              {
                icon: <ShieldCheck className="w-7 h-7 text-batiscore-orange" />,
                titre: "100% indépendant",
                desc: "Aucun devis, aucune commission, aucun paiement. Juste de l'information neutre.",
              },
            ].map((g) => (
              <div key={g.titre} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-center mb-4">{g.icon}</div>
                <h3 className="font-bold text-batiscore-navy mb-2">{g.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA final ─────────────────────────────────────────────────── */}
      <section className="bg-batiscore-orange py-16 px-4 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Vous avez fait appel à un artisan récemment ?
        </h2>
        <p className="text-orange-100 mb-8 max-w-xl mx-auto">
          Partagez votre expérience et aidez d&apos;autres particuliers à faire les bons choix.
        </p>
        <Link
          href="/avis/nouveau"
          className="inline-flex items-center gap-2 bg-white text-batiscore-orange font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors text-lg"
        >
          Laisser un avis gratuitement
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
