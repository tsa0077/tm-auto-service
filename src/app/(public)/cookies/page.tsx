import type { Metadata } from "next";
import ResetCookieButton from "@/components/layout/reset-cookie-button";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Politique de cookies | TM AUTO SERVICE",
  description: "Politique de cookies et gestion du consentement sur le site TM AUTO SERVICE.",
  url: "https://tm-auto-service.fr/cookies",
});

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Politique de cookies</h1>

      <div className="prose max-w-none space-y-6">
        <p>
          Ce site utilise des cookies pour améliorer votre expérience de navigation,
          analyser le trafic et personnaliser le contenu. Cette page vous informe sur
          les cookies utilisés et sur la manière de gérer vos préférences.
        </p>

        <section>
          <h2>Qu&apos;est-ce qu&apos;un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous
            visitez un site web. Les cookies permettent au site de se souvenir de vos
            actions et préférences pendant une certaine période.
          </p>
        </section>

        <section>
          <h2>Cookies utilisés</h2>

          <h3>Cookies essentiels</h3>
          <p>
            Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être
            désactivés. Ils incluent les cookies de session et de consentement.
          </p>
          <ul>
            <li><strong>tm-cookie-consent</strong> : Mémorise votre choix de consentement cookies</li>
          </ul>

          <h3>Cookies analytiques</h3>
          <p>
            Ces cookies nous permettent de mesurer l&apos;audience du site et d&apos;améliorer
            nos services. Ils ne sont activés qu&apos;avec votre consentement.
          </p>
          <ul>
            <li><strong>Google Analytics (GA4)</strong> : Analyse du trafic et du comportement des visiteurs</li>
            <li><strong>Meta Pixel</strong> : Mesure de l&apos;efficacité des campagnes publicitaires</li>
          </ul>

          <h3>Cookies tiers</h3>
          <p>
            Des cookies peuvent être déposés par des services tiers intégrés au site
            (chat en ligne, réseaux sociaux).
          </p>
        </section>

        <section>
          <h2>Gestion des cookies</h2>
          <p>
            Vous pouvez à tout moment modifier vos préférences en matière de cookies.
            Pour réinitialiser votre consentement, supprimez le cookie
            &quot;tm-cookie-consent&quot; de votre navigateur ou cliquez sur le bouton ci-dessous.
          </p>
        </section>

        <section>
          <h2>Durée de conservation</h2>
          <p>
            Les cookies sont conservés pour une durée maximale de 13 mois conformément
            aux recommandations de la CNIL.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Pour toute question relative aux cookies, contactez-nous à :
            contact@tm-auto-service.fr
          </p>
        </section>
      </div>

      <div className="mt-8 p-4 bg-neutral-50 rounded-lg border">
        <h3 className="font-semibold mb-2">Gérer vos préférences</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Cliquez ci-dessous pour réinitialiser votre consentement et afficher la bannière de cookies.
        </p>
        <ResetCookieButton />
      </div>
    </div>
  );
}
