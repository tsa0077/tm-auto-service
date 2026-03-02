import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LEAD_STATUS_LABELS, LEAD_SOURCE_LABELS } from "@/content/services";
import { Eye, Mail, Phone } from "lucide-react";

export default async function AdminLeadsPage(props: { searchParams: Promise<{ page?: string; status?: string }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const status = searchParams.status || "";
  const perPage = 20;

  const where = status ? { status: status as never } : {};

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { vehicle: { select: { title: true } } },
    }),
    prisma.lead.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const statusColorMap: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    CONVERTED: "bg-green-100 text-green-800",
    LOST: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leads ({total})</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link href="/admin/leads">
          <Badge variant={!status ? "default" : "outline"} className="cursor-pointer">
            Tous
          </Badge>
        </Link>
        {Object.entries(LEAD_STATUS_LABELS).map(([key, label]) => (
          <Link key={key} href={`/admin/leads?status=${key}`}>
            <Badge variant={status === key ? "default" : "outline"} className="cursor-pointer">
              {label}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Leads list */}
      <div className="space-y-3">
        {leads.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{lead.firstName} {lead.lastName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColorMap[lead.status] || ""}`}>
                      {LEAD_STATUS_LABELS[lead.status as keyof typeof LEAD_STATUS_LABELS] || lead.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {LEAD_SOURCE_LABELS[lead.source as keyof typeof LEAD_SOURCE_LABELS] || lead.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>
                    {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>}
                  </div>
                  {lead.vehicle && (
                    <p className="text-xs text-muted-foreground mt-1">Véhicule : {lead.vehicle.title}</p>
                  )}
                  {lead.message && (
                    <p className="text-sm mt-1 truncate max-w-md">{lead.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  <Link href={`/admin/leads/${lead.id}`}>
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {leads.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Aucun lead trouvé</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link key={i + 1} href={`/admin/leads?page=${i + 1}${status ? `&status=${status}` : ""}`}>
              <Button variant={page === i + 1 ? "default" : "outline"} size="sm">
                {i + 1}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
