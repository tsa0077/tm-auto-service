import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Politique de confidentialité | TM AUTO SERVICE",
  description: "Politique de confidentialité et protection des données personnelles de TM AUTO SERVICE.",
  url: "https://tm-auto-service.fr/confidentialite",
});

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Politique de confidentialité</h1>

      <div className="prose max-w-none space-y-6">
        <p>
          TM AUTO SERVICE accorde une grande importance à la protection de vos données personnelles.
          Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons
          vos informations.
        </p>

        <section>
          <h2>Données collectées</h2>
          <p>Nous collectons les données suivantes via nos formulaires :</p>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Numéro de téléphone</li>
            <li>Informations sur votre véhicule (dans le cadre d&apos;une reprise ou demande)</li>
            <li>Tout message que vous nous transmettez</li>
          </ul>
        </section>

        <section>
          <h2>Finalité du traitement</h2>
          <p>Vos données sont collectées pour :</p>
          <ul>
            <li>Répondre à vos demandes de contact</li>
            <li>Vous fournir des devis et estimations</li>
            <li>Gérer les demandes de reprise de véhicules</li>
            <li>Vous informer sur nos véhicules et services</li>
            <li>Améliorer notre site et nos services</li>
          </ul>
        </section>

        <section>
          <h2>Base juridique</h2>
          <p>
            Le traitement de vos données est fondé sur votre consentement et/ou l&apos;exécution
            d&apos;un contrat ou de mesures précontractuelles.
          </p>
        </section>

        <section>
          <h2>Durée de conservation</h2>
          <p>
            Vos données sont conservées pendant une durée de 3 ans à compter de votre dernière
            interaction avec nous, sauf obligation légale contraire.
          </p>
        </section>

        <section>
          <h2>Partage des données</h2>
          <p>
            Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec
            nos prestataires techniques (hébergement, email) dans le strict cadre de la fourniture
            de nos services.
          </p>
        </section>

        <section>
          <h2>Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul>
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d&apos;opposition</li>
            <li>Droit à la limitation du traitement</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à : contact@tm-auto-service.fr
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            Pour en savoir plus sur notre utilisation des cookies, consultez notre{" "}
            <a href="/cookies" className="text-red-600 hover:underline">politique de cookies</a>.
          </p>
        </section>

        <section>
          <h2>Contact DPO</h2>
          <p>
            Pour toute question relative à la protection de vos données, contactez-nous à :<br />
            Email : contact@tm-auto-service.fr<br />
            Adresse : Quesnoy-sur-Deûle, 59890, France
          </p>
        </section>
      </div>
    </div>
  );
}
