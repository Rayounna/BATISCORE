import Link from "next/link";
import { Search, HardHat } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-batiscore-orange rounded-lg p-1.5">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-batiscore-navy tracking-tight">
              BATI<span className="text-batiscore-orange">SCORE</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/annuaire"
              className="text-gray-600 hover:text-batiscore-navy font-medium text-sm transition-colors"
            >
              Annuaire
            </Link>
            <Link
              href="/annuaire"
              className="text-gray-600 hover:text-batiscore-navy font-medium text-sm transition-colors"
            >
              Comment ça marche ?
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/annuaire"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-batiscore-navy transition-colors"
            >
              <Search className="w-4 h-4" />
              Chercher un artisan
            </Link>
            <Link
              href="/avis/nouveau"
              className="bg-batiscore-orange hover:bg-batiscore-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Laisser un avis
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
