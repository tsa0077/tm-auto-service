import {
  Wrench,
  Search,
  Car,
  ArrowLeftRight,
  CalendarDays,
  Droplets,
} from "lucide-react";

export interface ServiceItem {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  description: string;
  features: string[];
  faq: { question: string; answer: string }[];
}

export const SERVICES: ServiceItem[] = [
  {
    slug: "diagnostic-electronique",
    title: "Diagnostic Électronique",
    shortDescription:
      "Analyse complète de votre véhicule avec nos outils de diagnostic de dernière génération.",
    icon: "Search",
    description:
      "Notre équipe utilise des outils de diagnostic de dernière génération pour analyser en profondeur les systèmes électroniques de votre véhicule. Nous identifions rapidement les pannes et dysfonctionnements pour un diagnostic précis et fiable.",
    features: [
      "Lecture et effacement des codes défauts",
      "Diagnostic moteur complet",
      "Analyse du système de freinage ABS/ESP",
      "Contrôle du système d'injection",
      "Vérification des capteurs et sondes",
      "Diagnostic climatisation",
    ],
    faq: [
      {
        question: "Combien de temps dure un diagnostic ?",
        answer:
          "Un diagnostic complet prend généralement entre 30 minutes et 1 heure selon la complexité du véhicule.",
      },
      {
        question: "Le diagnostic est-il gratuit ?",
        answer:
          "Le diagnostic de base est offert pour tout devis accepté. Contactez-nous pour les tarifs.",
      },
    ],
  },
  {
    slug: "reparation-mecanique",
    title: "Réparation Mécanique",
    shortDescription:
      "Réparations toutes marques : moteur, freins, suspension, embrayage et plus encore.",
    icon: "Wrench",
    description:
      "Spécialisés dans la réparation mécanique toutes marques, nous intervenons sur l'ensemble des organes de votre véhicule. De la simple révision à la réparation complexe, notre savoir-faire garantit un travail de qualité.",
    features: [
      "Réparation et remplacement moteur",
      "Système de freinage complet",
      "Suspension et amortisseurs",
      "Embrayage et boîte de vitesses",
      "Direction et train roulant",
      "Système d'échappement",
    ],
    faq: [
      {
        question: "Travaillez-vous sur toutes les marques ?",
        answer:
          "Oui, nous sommes un garage multi-marques et intervenons sur tous les types de véhicules.",
      },
      {
        question: "Proposez-vous un véhicule de remplacement ?",
        answer:
          "Oui, nous disposons de véhicules de courtoisie sous réserve de disponibilité. Contactez-nous à l'avance.",
      },
    ],
  },
  {
    slug: "entretien-vidange",
    title: "Entretien & Vidange",
    shortDescription:
      "Entretien régulier et vidanges pour préserver la longévité de votre véhicule.",
    icon: "Droplets",
    description:
      "L'entretien régulier est essentiel pour la longévité et la sécurité de votre véhicule. Nous réalisons toutes les opérations d'entretien courant dans le respect des préconisations constructeur.",
    features: [
      "Vidange moteur et filtres",
      "Remplacement courroie de distribution",
      "Contrôle et remplacement des bougies",
      "Remplacement liquide de frein",
      "Contrôle des niveaux",
      "Préparation au contrôle technique",
    ],
    faq: [
      {
        question: "À quelle fréquence faire la vidange ?",
        answer:
          "En général tous les 15 000 à 30 000 km ou une fois par an, selon le constructeur et l'utilisation.",
      },
    ],
  },
  {
    slug: "achat-vente",
    title: "Achat & Vente",
    shortDescription:
      "Large choix de véhicules d'occasion révisés et garantis. Financement possible.",
    icon: "Car",
    description:
      "Découvrez notre sélection de véhicules d'occasion soigneusement révisés et contrôlés. Chaque véhicule bénéficie d'une garantie et d'un rapport d'inspection détaillé. Nous proposons également des solutions de financement adaptées.",
    features: [
      "Véhicules révisés et contrôlés",
      "Garantie incluse",
      "Rapport d'inspection détaillé",
      "Financement sur mesure",
      "Reprise de votre ancien véhicule",
      "Livraison possible",
    ],
    faq: [
      {
        question: "Vos véhicules sont-ils garantis ?",
        answer:
          "Oui, tous nos véhicules en vente sont garantis. La durée de garantie varie selon le véhicule.",
      },
    ],
  },
  {
    slug: "reprise-vehicule",
    title: "Reprise Véhicule",
    shortDescription:
      "Estimation gratuite de votre véhicule. Reprise immédiate au meilleur prix.",
    icon: "ArrowLeftRight",
    description:
      "Vous souhaitez vendre ou échanger votre véhicule ? Nous proposons une estimation gratuite et une reprise immédiate au prix juste. Simplifiez vos démarches en combinant reprise et achat.",
    features: [
      "Estimation gratuite sans engagement",
      "Reprise immédiate",
      "Prix du marché transparent",
      "Démarches administratives simplifiées",
      "Combinaison reprise + achat",
      "Tout type de véhicule accepté",
    ],
    faq: [
      {
        question: "Comment se passe l'estimation ?",
        answer:
          "Remplissez notre formulaire en ligne ou venez directement au garage. Nous évaluons votre véhicule et vous proposons un prix sous 24h.",
      },
    ],
  },
  {
    slug: "location-vehicule",
    title: "Location Véhicule",
    shortDescription:
      "Location courte et longue durée. Véhicules récents et bien entretenus.",
    icon: "CalendarDays",
    description:
      "Besoin d'un véhicule pour quelques jours ou plusieurs mois ? Notre service de location vous propose des véhicules récents, parfaitement entretenus, à des tarifs compétitifs.",
    features: [
      "Location courte durée (jour/semaine)",
      "Location longue durée (mois)",
      "Véhicules récents et entretenus",
      "Assurance incluse",
      "Kilométrage flexible",
      "Livraison et récupération possibles",
    ],
    faq: [
      {
        question: "Quels documents faut-il pour louer ?",
        answer:
          "Un permis de conduire valide, une pièce d'identité et un justificatif de domicile. Une caution sera demandée.",
      },
    ],
  },
];

export const HERO_CONTENT = {
  title: "TM AUTO SERVICE",
  subtitle: "Garage multi-marques à Quesnoy-sur-Deûle",
  badges: [
    "Diagnostic",
    "Réparation",
    "Reprise",
    "Achat/Vente",
    "Location",
  ],
  description:
    "Votre partenaire de confiance pour l'entretien, la réparation et la vente de véhicules. Expertise multi-marques, qualité de service et transparence sont nos engagements depuis plus de 10 ans.",
};

export const WHY_US = [
  {
    title: "Rapidité",
    description:
      "Diagnostic rapide et interventions dans les meilleurs délais pour vous remettre sur la route au plus vite.",
  },
  {
    title: "Transparence",
    description:
      "Devis détaillé et gratuit avant chaque intervention. Aucune surprise sur la facture finale.",
  },
  {
    title: "Multi-marques",
    description:
      "Nous intervenons sur toutes les marques et tous les modèles, des citadines aux utilitaires.",
  },
  {
    title: "Service professionnel",
    description:
      "Équipe qualifiée et passionnée, outils de dernière génération et pièces de qualité.",
  },
];

export const TRUST_BADGES = [
  { label: "+500 clients satisfaits", value: "500+" },
  { label: "Années d'expérience", value: "10+" },
  { label: "Véhicules vendus", value: "200+" },
  { label: "Note Google", value: "4.8/5" },
];

export const MAKES = [
  "Audi",
  "BMW",
  "Citroën",
  "Dacia",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Kia",
  "Mercedes",
  "Nissan",
  "Opel",
  "Peugeot",
  "Renault",
  "Seat",
  "Skoda",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

export const FUEL_LABELS: Record<string, string> = {
  ESSENCE: "Essence",
  DIESEL: "Diesel",
  HYBRIDE: "Hybride",
  ELECTRIQUE: "Électrique",
  GPL: "GPL",
};

export const TRANSMISSION_LABELS: Record<string, string> = {
  MANUELLE: "Manuelle",
  AUTOMATIQUE: "Automatique",
};

export const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Réservé",
  SOLD: "Vendu",
  RENTED: "Loué",
  MAINTENANCE: "En maintenance",
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  IN_PROGRESS: "En cours",
  CONVERTED: "Converti",
  LOST: "Perdu",
};

export const LEAD_SOURCE_LABELS: Record<string, string> = {
  CONTACT: "Contact",
  VEHICLE: "Véhicule",
  REPRISE: "Reprise",
  LOCATION: "Location",
};

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getServiceIcon(iconName: string) {
  const icons: Record<string, typeof Wrench> = {
    Wrench,
    Search,
    Car,
    ArrowLeftRight,
    CalendarDays,
    Droplets,
  };
  return icons[iconName] || Wrench;
}
