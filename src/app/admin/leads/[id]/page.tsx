import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LEAD_SOURCE_LABELS } from "@/content/services";
import LeadStatusUpdater from "./status-updater";

export default async function AdminLeadDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { vehicle: { select: { title: true, slug: true } } },
  });

  if (!lead) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        Lead — {lead.firstName} {lead.lastName}
      </h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Nom :</strong> {lead.firstName} {lead.lastName}</p>
            <p><strong>Email :</strong> <a href={`mailto:${lead.email}`} className="text-primary underline">{lead.email}</a></p>
            {lead.phone && <p><strong>Téléphone :</strong> <a href={`tel:${lead.phone}`} className="text-primary underline">{lead.phone}</a></p>}
            <p><strong>Source :</strong> {LEAD_SOURCE_LABELS[lead.source as keyof typeof LEAD_SOURCE_LABELS] || lead.source}</p>
            <p><strong>Reçu le :</strong> {new Date(lead.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{lead.message || "—"}</p>
            {lead.vehicle && (
              <p className="mt-3 text-sm text-muted-foreground">Véhicule concerné : <strong>{lead.vehicle.title}</strong></p>
            )}
          </CardContent>
        </Card>

        {/* Reprise info */}
        {(lead.repriseMarque || lead.repriseModele || lead.repriseAnnee || lead.repriseKm) && (
          <Card>
            <CardHeader>
              <CardTitle>Reprise véhicule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lead.repriseMarque && <p><strong>Marque :</strong> {lead.repriseMarque}</p>}
              {lead.repriseModele && <p><strong>Modèle :</strong> {lead.repriseModele}</p>}
              {lead.repriseAnnee && <p><strong>Année :</strong> {lead.repriseAnnee}</p>}
              {lead.repriseKm && <p><strong>Kilométrage :</strong> {lead.repriseKm}</p>}
              {lead.repriseDetails && <p><strong>Détails :</strong> {lead.repriseDetails}</p>}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadStatusUpdater leadId={lead.id} currentStatus={lead.status} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
