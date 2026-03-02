import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TM AUTO SERVICE | Garage Multi-Marques à Quesnoy-sur-Deûle",
    template: "%s | TM AUTO SERVICE",
  },
  description:
    "Garage automobile multi-marques à Quesnoy-sur-Deûle : diagnostic, réparation, entretien, achat/vente, reprise et location de véhicules.",
  metadataBase: new URL("https://tm-auto-service.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "TM AUTO SERVICE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
