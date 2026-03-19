import type { Metadata } from "next";
import { AvisForm } from "./AvisForm";

export const metadata: Metadata = {
  title: "Laisser un avis",
  description:
    "Partagez votre expérience avec un artisan BTP. Avis structuré, 7 critères de notation, preuve facultative pour renforcer la crédibilité.",
};

export default async function NouvelAvisPage({
  searchParams,
}: {
  searchParams: Promise<{ siret?: string }>;
}) {
  const params = await searchParams;
  const siret = params.siret ?? "";

  return (
    <div className="min-h-screen bg-batiscore-cream py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-batiscore-navy mb-2">
            Laisser un avis
          </h1>
          <p className="text-gray-500">
            Votre avis aide d&apos;autres particuliers à choisir un artisan de
            confiance. Il sera vérifié avant publication.
          </p>
        </div>
        <AvisForm siretInitial={siret} />
      </div>
    </div>
  );
}
