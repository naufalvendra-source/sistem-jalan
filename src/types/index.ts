export type UserRole = 'masyarakat' | 'petugas' | 'admin';

export type DamageCategory = 
  | 'Lubang Besar (Pothole)'
  | 'Jalan Amblas / Penurunan'
  | 'Retak Buaya / Rusak Parah'
  | 'Aspal Mengelupas / Terkikis'
  | 'Drainase Rusak / Banjir Genangan'
  | 'Gelombang Jalan / Rutting';

export type DamageSeverity = 'Ringan' | 'Sedang' | 'Berat';

export type ReportStatus = 
  | 'Menunggu Verifikasi'
  | 'Diverifikasi'
  | 'Ditugaskan'
  | 'Dalam Perbaikan'
  | 'Selesai'
  | 'Ditolak';

export type RoadAuthority = 'Jalan Kota Palembang' | 'Jalan Provinsi Sumsel' | 'Jalan Nasional';

export type RoadCondition = 'Baik' | 'Sedang' | 'Rusak Ringan' | 'Rusak Berat';

export interface TimelineEvent {
  id: string;
  status: ReportStatus;
  timestamp: string;
  actor: string;
  notes: string;
  photoUrl?: string;
}

export interface RoadReport {
  id: string;
  ticketCode: string; // e.g. PLB-2026-1042
  title: string;
  roadName: string;
  district: string; // Kecamatan
  subDistrict?: string; // Kelurahan
  locationLandmark: string;
  latitude: number;
  longitude: number;
  category: DamageCategory;
  severity: DamageSeverity;
  description: string;
  photoBefore: string;
  photoAfter?: string;
  photoProgress?: string;
  status: ReportStatus;
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
  reporterNik?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  workTeam?: string;
  createdAt: string;
  updatedAt: string;
  estimatedCompletionDate?: string;
  rejectionReason?: string;
  repairMaterialVolume?: string; // e.g. "Aspal Hotmix AC-WC 15 ton"
  timeline: TimelineEvent[];
}

export interface RoadMasterData {
  id: string;
  roadCode: string; // e.g. PLB-RD-01
  name: string;
  district: string;
  lengthKm: number;
  widthMeters: number;
  pavementType: 'Aspal Hotmix' | 'Rigid Beton' | 'Lapen' | 'Paving';
  authority: RoadAuthority;
  condition: RoadCondition;
  latitude: number;
  longitude: number;
  lastInspectionDate: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  nikOrNip: string;
  assignedDistrict?: string;
  agency?: string;
  status: 'Aktif' | 'Nonaktif';
  avatar?: string;
  createdAt: string;
}
