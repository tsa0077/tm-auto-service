import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import prisma from "@/lib/db";
import { Car, MessageSquare, TrendingUp, DollarSign } from "lucide-react";
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS } from "@/content/services";

async function getDashboardData() {
  try {
    const [vehicleCount, leadCount, newLeads, recentLeads] = await Promise.all([
      prisma.vehicle.count(),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { vehicle: { select: { title: true } } },
      }),
    ]);
    return { vehicleCount, leadCount, newLeads, recentLeads };
  } catch {
    return { vehicleCount: 0, leadCount: 0, newLeads: 0, recentLeads: [] };
  }
}

export default async function AdminDashboardPage() {
  const { vehicleCount, leadCount, newLeads, recentLeads } = await getDashboardData();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Véhicules", value: vehicleCount, icon: Car, color: "text-blue-600" },
          { label: "Total leads", value: leadCount, icon: MessageSquare, color: "text-green-600" },
          { label: "Nouveaux leads", value: newLeads, icon: TrendingUp, color: "text-red-600" },
          { label: "Taux conv.", value: "—", icon: DollarSign, color: "text-yellow-600" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-neutral-100 ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent leads */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Derniers leads</CardTitle>
          <Link href="/admin/leads" className="text-sm text-red-600 hover:underline">
            Voir tous →
          </Link>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucun lead pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-md"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lead.email} • {lead.phone}
                    </p>
                    {lead.vehicle && (
                      <p className="text-xs text-muted-foreground">
                        Véhicule : {lead.vehicle.title}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{LEAD_SOURCE_LABELS[lead.source] || lead.source}</Badge>
                    <Badge variant={lead.status === "NEW" ? "default" : "secondary"}>
                      {LEAD_STATUS_LABELS[lead.status] || lead.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
