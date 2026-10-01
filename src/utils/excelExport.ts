import * as XLSX from 'xlsx';
import { RoadReport, RoadMasterData, AppUser } from '../types';

export const exportReportsToExcel = (reports: RoadReport[], filename = 'Laporan_Kerusakan_Jalan_Palembang.xlsx') => {
  // 1. Sheet Data Laporan
  const reportRows = reports.map(r => ({
    'Nomor Tiket': r.ticketCode,
    'Nama Jalan': r.roadName,
    'Kecamatan': r.district,
    'Kelurahan': r.subDistrict || '-',
    'Patokan Lokasi': r.locationLandmark,
    'Kategori Kerusakan': r.category,
    'Tingkat Keparahan': r.severity,
    'Status Penanganan': r.status,
    'Latitude': r.latitude,
    'Longitude': r.longitude,
    'Nama Pelapor': r.reporterName,
    'No. WhatsApp Pelapor': r.reporterPhone,
    'Petugas Penanggung Jawab': r.assignedOfficerName || '-',
    'Tim Kerja UPTD': r.workTeam || '-',
    'Volume Material': r.repairMaterialVolume || '-',
    'Tanggal Lapor': new Date(r.createdAt).toLocaleString('id-ID'),
    'Keterangan Deskripsi': r.description,
  }));

  // 2. Sheet Ringkasan Statistik
  const summaryRows = [
    { Metrik: 'Total Aduan Masuk', Nilai: reports.length },
    { Metrik: 'Selesai Tuntas', Nilai: reports.filter(r => r.status === 'Selesai').length },
    { Metrik: 'Dalam Perbaikan', Nilai: reports.filter(r => r.status === 'Dalam Perbaikan').length },
    { Metrik: 'Ditugaskan ke UPTD', Nilai: reports.filter(r => r.status === 'Ditugaskan').length },
    { Metrik: 'Menunggu Verifikasi', Nilai: reports.filter(r => r.status === 'Menunggu Verifikasi').length },
    { Metrik: 'Ditolak / Dialihkan', Nilai: reports.filter(r => r.status === 'Ditolak').length },
    { Metrik: 'Tingkat Keparahan Berat (Darurat)', Nilai: reports.filter(r => r.severity === 'Berat').length },
    { Metrik: 'Tingkat Keparahan Sedang', Nilai: reports.filter(r => r.severity === 'Sedang').length },
    { Metrik: 'Tingkat Keparahan Ringan', Nilai: reports.filter(r => r.severity === 'Ringan').length },
  ];

  const wb = XLSX.utils.book_new();
  const wsReports = XLSX.utils.json_to_sheet(reportRows);
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);

  // Set column widths
  wsReports['!cols'] = [
    { wch: 16 }, // Nomor Tiket
    { wch: 26 }, // Nama Jalan
    { wch: 18 }, // Kecamatan
    { wch: 16 }, // Kelurahan
    { wch: 35 }, // Patokan Lokasi
    { wch: 25 }, // Kategori Kerusakan
    { wch: 18 }, // Tingkat Keparahan
    { wch: 20 }, // Status Penanganan
    { wch: 12 }, // Latitude
    { wch: 12 }, // Longitude
    { wch: 22 }, // Nama Pelapor
    { wch: 18 }, // No WhatsApp
    { wch: 24 }, // Petugas
    { wch: 25 }, // Tim UPTD
    { wch: 25 }, // Volume
    { wch: 20 }, // Tanggal
    { wch: 45 }, // Deskripsi
  ];

  wsSummary['!cols'] = [
    { wch: 35 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, wsReports, 'Data Aduan Jalan');
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Statistik');

  XLSX.writeFile(wb, filename);
};

export const exportRoadsToExcel = (roads: RoadMasterData[], filename = 'Master_Data_Ruas_Jalan_Palembang.xlsx') => {
  const roadRows = roads.map(r => ({
    'Kode Ruas': r.roadCode,
    'Nama Jalan': r.name,
    'Kecamatan': r.district,
    'Panjang (km)': r.lengthKm,
    'Lebar (meter)': r.widthMeters,
    'Tipe Perkerasan': r.pavementType,
    'Status Kewenangan': r.authority,
    'Kondisi Kemantapan': r.condition,
    'Latitude': r.latitude,
    'Longitude': r.longitude,
    'Tanggal Terakhir Inspeksi': r.lastInspectionDate,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(roadRows);

  ws['!cols'] = [
    { wch: 15 },
    { wch: 28 },
    { wch: 18 },
    { wch: 14 },
    { wch: 14 },
    { wch: 18 },
    { wch: 24 },
    { wch: 18 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Master Ruas Jalan');
  XLSX.writeFile(wb, filename);
};

export const exportCompleteDatabaseExcel = (
  reports: RoadReport[], 
  roads: RoadMasterData[], 
  users: AppUser[]
) => {
  const wb = XLSX.utils.book_new();

  // 1. Reports
  const reportRows = reports.map(r => ({
    ticket_code: r.ticketCode,
    nama_jalan: r.roadName,
    kecamatan: r.district,
    patokan_lokasi: r.locationLandmark,
    kategori: r.category,
    tingkat_keparahan: r.severity,
    status: r.status,
    latitude: r.latitude,
    longitude: r.longitude,
    pelapor: r.reporterName,
    no_hp_pelapor: r.reporterPhone,
    petugas: r.assignedOfficerName || '',
    tim_kerja: r.workTeam || '',
    volume_material: r.repairMaterialVolume || '',
    created_at: r.createdAt,
  }));
  const wsReports = XLSX.utils.json_to_sheet(reportRows);
  XLSX.utils.book_append_sheet(wb, wsReports, 'tb_laporan_jalan');

  // 2. Roads
  const roadRows = roads.map(r => ({
    kode_ruas: r.roadCode,
    nama_jalan: r.name,
    kecamatan: r.district,
    panjang_km: r.lengthKm,
    lebar_m: r.widthMeters,
    tipe_perkerasan: r.pavementType,
    kewenangan: r.authority,
    kondisi: r.condition,
    latitude: r.latitude,
    longitude: r.longitude,
    tgl_inspeksi: r.lastInspectionDate,
  }));
  const wsRoads = XLSX.utils.json_to_sheet(roadRows);
  XLSX.utils.book_append_sheet(wb, wsRoads, 'tb_master_jalan');

  // 3. Users
  const userRows = users.map(u => ({
    id: u.id,
    nama: u.name,
    email: u.email,
    no_hp: u.phone,
    role: u.role,
    nik_nip: u.nikOrNip,
    wilayah_tugas: u.assignedDistrict || '',
    instansi: u.agency || '',
    status: u.status,
  }));
  const wsUsers = XLSX.utils.json_to_sheet(userRows);
  XLSX.utils.book_append_sheet(wb, wsUsers, 'tb_users');

  const todayStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Database_SIPELAJAR_Palembang_${todayStr}.xlsx`);
};

export const parseExcelFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
