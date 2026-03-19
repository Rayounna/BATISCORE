import Link from "next/link";
import { HardHat } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-batiscore-navy text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-batiscore-orange rounded-lg p-1.5">
                <HardHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                BATI<span className="text-batiscore-orange">SCORE</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              La plateforme de référence pour évaluer la fiabilité des artisans
              et entreprises du bâtiment en France.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Données SIRET : API Entreprise (DINUM) — Certifications RGE : ADEME
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Annuaire</h3>
            <ul className="space-y-2 text-sm">
              {["Plombiers", "Électriciens", "Maçons", "Couvreurs", "Peintres"].map(
                (metier) => (
                  <li key={metier}>
                    <Link
                      href={`/annuaire?metier=${metier.toLowerCase()}`}
                      className="hover:text-white transition-colors"
                    >
                      {metier}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-3">À propos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Comment ça marche ?
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Score BATISCORE
                </Link>
              </li>
              <li>
                <Link href="/avis/nouveau" className="hover:text-white transition-colors">
                  Laisser un avis
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BATISCORE — Tous droits réservés</p>
          <p>Plateforme d&apos;information — Aucune intermédiation commerciale</p>
        </div>
      </div>
    </footer>
  );
}
