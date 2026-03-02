"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";

interface SettingsData {
  metaPixelId: string;
  ga4MeasurementId: string;
  gtmId: string;
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappEnabled: boolean;
  chatProvider: string;
  chatScript: string;
  chatEnabled: boolean;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessHours: string;
  businessDescription: string;
  googleMapsUrl: string;
}

const defaultSettings: SettingsData = {
  metaPixelId: "",
  ga4MeasurementId: "",
  gtmId: "",
  whatsappNumber: "",
  whatsappMessage: "Bonjour, je vous contacte depuis votre site web.",
  whatsappEnabled: false,
  chatProvider: "TAWK",
  chatScript: "",
  chatEnabled: false,
  businessName: "TM Auto Service",
  businessAddress: "",
  businessPhone: "",
  businessEmail: "",
  businessHours: "",
  businessDescription: "",
  googleMapsUrl: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings({ ...defaultSettings, ...data });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function saveSection(section: string, data: Partial<SettingsData>) {
    setSaving(section);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings((prev) => ({ ...prev, ...updated }));
      }
    } finally {
      setSaving("");
    }
  }

  function update(key: keyof SettingsData, value: string | boolean) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

      <Tabs defaultValue="tracking" className="max-w-3xl">
        <TabsList className="mb-6">
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="business">Entreprise</TabsTrigger>
        </TabsList>

        {/* Tracking */}
        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Pixels & Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Facebook Pixel ID</Label>
                <Input value={settings.metaPixelId} onChange={(e) => update("metaPixelId", e.target.value)} placeholder="1234567890" />
              </div>
              <div>
                <Label>Google Analytics 4 ID</Label>
                <Input value={settings.ga4MeasurementId} onChange={(e) => update("ga4MeasurementId", e.target.value)} placeholder="G-XXXXXXXXXX" />
              </div>
              <div>
                <Label>Google Tag Manager ID</Label>
                <Input value={settings.gtmId} onChange={(e) => update("gtmId", e.target.value)} placeholder="GTM-XXXXXXX" />
              </div>
              <Button
                onClick={() => saveSection("tracking", { metaPixelId: settings.metaPixelId, ga4MeasurementId: settings.ga4MeasurementId, gtmId: settings.gtmId })}
                disabled={saving === "tracking"}
              >
                {saving === "tracking" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp */}
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch checked={settings.whatsappEnabled} onCheckedChange={(v) => update("whatsappEnabled", v)} />
                <Label>Activer le bouton WhatsApp</Label>
              </div>
              <div>
                <Label>Numéro WhatsApp (format international)</Label>
                <Input value={settings.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} placeholder="+33612345678" />
              </div>
              <div>
                <Label>Message pré-rempli</Label>
                <Input value={settings.whatsappMessage} onChange={(e) => update("whatsappMessage", e.target.value)} />
              </div>
              <Button
                onClick={() => saveSection("whatsapp", { whatsappEnabled: settings.whatsappEnabled, whatsappNumber: settings.whatsappNumber, whatsappMessage: settings.whatsappMessage })}
                disabled={saving === "whatsapp"}
              >
                {saving === "whatsapp" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch checked={settings.chatEnabled} onCheckedChange={(v) => update("chatEnabled", v)} />
                <Label>Activer le chat en direct</Label>
              </div>
              <div>
                <Label>Fournisseur</Label>
                <Select value={settings.chatProvider} onValueChange={(v) => update("chatProvider", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TAWK">Tawk.to</SelectItem>
                    <SelectItem value="CRISP">Crisp</SelectItem>
                    <SelectItem value="TIDIO">Tidio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Script du widget</Label>
                <Input value={settings.chatScript} onChange={(e) => update("chatScript", e.target.value)} placeholder="Script ou ID de votre widget" />
              </div>
              <Button
                onClick={() => saveSection("chat", { chatEnabled: settings.chatEnabled, chatProvider: settings.chatProvider, chatScript: settings.chatScript })}
                disabled={saving === "chat"}
              >
                {saving === "chat" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l&apos;entreprise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nom de l&apos;entreprise</Label>
                <Input value={settings.businessName} onChange={(e) => update("businessName", e.target.value)} />
              </div>
              <div>
                <Label>Adresse complète</Label>
                <Input value={settings.businessAddress} onChange={(e) => update("businessAddress", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Téléphone</Label>
                  <Input value={settings.businessPhone} onChange={(e) => update("businessPhone", e.target.value)} placeholder="+33 1 23 45 67 89" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={settings.businessEmail} onChange={(e) => update("businessEmail", e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Horaires d&apos;ouverture</Label>
                <Input value={settings.businessHours} onChange={(e) => update("businessHours", e.target.value)} placeholder="Lun-Ven: 8h-19h, Sam: 9h-17h" />
              </div>
              <div>
                <Label>Description courte</Label>
                <Input value={settings.businessDescription} onChange={(e) => update("businessDescription", e.target.value)} />
              </div>
              <div>
                <Label>URL Google Maps (iframe embed)</Label>
                <Input value={settings.googleMapsUrl} onChange={(e) => update("googleMapsUrl", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
              </div>
              <Button
                onClick={() =>
                  saveSection("business", {
                    businessName: settings.businessName,
                    businessAddress: settings.businessAddress,
                    businessPhone: settings.businessPhone,
                    businessEmail: settings.businessEmail,
                    businessHours: settings.businessHours,
                    businessDescription: settings.businessDescription,
                    googleMapsUrl: settings.googleMapsUrl,
                  })
                }
                disabled={saving === "business"}
              >
                {saving === "business" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
