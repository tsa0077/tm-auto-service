import { z } from "zod";

// ─── Lead Form ───────────────────────────────────────────────────────

export const leadSchema = z.object({
  source: z.enum(["CONTACT", "VEHICLE", "REPRISE", "LOCATION"]),
  firstName: z.string().min(2, "Prénom requis (2 caractères minimum)"),
  lastName: z.string().min(2, "Nom requis (2 caractères minimum)"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Téléphone requis"),
  message: z.string().optional(),
  vehicleId: z.string().optional(),
  repriseMarque: z.string().optional(),
  repriseModele: z.string().optional(),
  repriseAnnee: z.coerce.number().optional(),
  repriseKm: z.coerce.number().optional(),
  repriseDetails: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

// ─── Vehicle ─────────────────────────────────────────────────────────

export const vehicleSchema = z.object({
  type: z.enum(["SALE", "RENT"]),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD", "RENTED", "MAINTENANCE"]),
  title: z.string().min(3, "Titre requis"),
  make: z.string().min(1, "Marque requise"),
  model: z.string().min(1, "Modèle requis"),
  year: z.coerce.number().min(1990).max(2030),
  price: z.coerce.number().optional().nullable(),
  priceLabel: z.string().optional().nullable(),
  mileage: z.coerce.number().optional().nullable(),
  fuel: z.enum(["ESSENCE", "DIESEL", "HYBRIDE", "ELECTRIQUE", "GPL"]),
  transmission: z.enum(["MANUELLE", "AUTOMATIQUE"]),
  power: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  doors: z.coerce.number().optional().nullable(),
  seats: z.coerce.number().optional().nullable(),
  description: z.string().optional().nullable(),
  features: z.union([z.array(z.string()), z.string()]).optional(),
  options: z.union([z.array(z.string()), z.string()]).optional(),
  dailyRate: z.coerce.number().optional().nullable(),
  weeklyRate: z.coerce.number().optional().nullable(),
  monthlyRate: z.coerce.number().optional().nullable(),
  deposit: z.coerce.number().optional().nullable(),
  featured: z.boolean().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;

// ─── Settings ────────────────────────────────────────────────────────

export const settingsSchema = z.object({
  trackingEnabled: z.boolean().optional(),
  metaPixelId: z.string().optional(),
  ga4MeasurementId: z.string().optional(),
  gtmId: z.string().optional(),
  cookieConsentEnabled: z.boolean().optional(),
  whatsappEnabled: z.boolean().optional(),
  whatsappNumber: z.string().optional(),
  whatsappMessageTemplate: z.string().optional(),
  chatEnabled: z.boolean().optional(),
  chatProvider: z.enum(["TAWKTO", "CRISP"]).optional(),
  chatScript: z.string().optional(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().optional(),
  businessAddress: z.string().optional(),
  businessCity: z.string().optional(),
  businessZipCode: z.string().optional(),
  businessCountry: z.string().optional(),
  hoursWeekday: z.string().optional(),
  hoursSaturday: z.string().optional(),
  hoursSunday: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialGoogle: z.string().optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

// ─── Login ───────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis (6 caractères minimum)"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
