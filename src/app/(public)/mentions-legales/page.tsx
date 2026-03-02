import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Mentions légales | TM AUTO SERVICE",
  description: "Mentions légales du site TM AUTO SERVICE.",
  url: "https://tm-auto-service.fr/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Mentions légales</h1>

      <div className="prose max-w-none space-y-6">
        <section>
          <h2>Éditeur du site</h2>
          <p>
            <strong>TM AUTO SERVICE</strong><br />
            Adresse : Quesnoy-sur-Deûle, 59890, France<br />
            Téléphone : +33 X XX XX XX XX<br />
            Email : contact@tm-auto-service.fr<br />
            SIRET : [À compléter]<br />
            Directeur de la publication : [À compléter]
          </p>
        </section>

        <section>
          <h2>Hébergement</h2>
          <p>
            Ce site est hébergé par [À compléter].<br />
            Adresse de l&apos;hébergeur : [À compléter]
          </p>
        </section>

        <section>
          <h2>Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, etc.)
            est la propriété exclusive de TM AUTO SERVICE, sauf mention contraire. Toute
            reproduction, représentation, modification, publication ou adaptation de tout ou
            partie des éléments du site est interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section>
          <h2>Responsabilité</h2>
          <p>
            TM AUTO SERVICE s&apos;efforce de fournir des informations aussi précises que possible
            sur ce site. Toutefois, il ne pourra être tenu responsable des omissions, inexactitudes
            ou carences dans la mise à jour des informations.
          </p>
        </section>

        <section>
          <h2>Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens hypertextes vers d&apos;autres sites. TM AUTO SERVICE
            ne dispose d&apos;aucun moyen de contrôle du contenu de ces sites tiers et n&apos;assume
            aucune responsabilité quant à leur contenu.
          </p>
        </section>

        <section>
          <h2>Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige,
            les tribunaux français seront seuls compétents.
          </p>
        </section>
      </div>
    </div>
  );
}
