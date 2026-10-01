import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PalembangMap } from '../components/PalembangMap';
import { PALEMBANG_DISTRICTS } from '../data/initialData';
import { RoadReport, ReportStatus, DamageSeverity } from '../types';
import { 
  Map, 
  Filter, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  UserCheck, 
  Wrench, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const HalamanPetaAdmin: React.FC = () => {
  const { reports, updateReportStatus, assignReport, users, setSelectedTicket, setActivePage } = useApp();

  const [filterDistrict, setFilterDistrict] = useState<string>('Semua');
  const [filterSeverity, setFilterSeverity] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [selectedReport, setSelectedReport] = useState<RoadReport | null>(reports[0] || null);

  // Quick action states
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredReports = reports.filter(r => {
    if (filterDistrict !== 'Semua' && r.district !== filterDistrict) return false;
    if (filterSeverity !== 'Semua' && r.severity !== filterSeverity) return false;
    if (filterStatus !== 'Semua' && r.status !== filterStatus) return false;
    return true;
  });

  const handleVerify = (rep: RoadReport) => {
    updateReportStatus(rep.id, 'Diverifikasi', 'Laporan diverifikasi teknis oleh Admin Dinas PUPR.');
    setActionSuccess(`Laporan ${rep.ticketCode} berhasil diverifikasi!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleQuickAssign = (rep: RoadReport) => {
    const officer = users.find(u => u.role === 'petugas');
    if (officer) {
      assignReport(rep.id, officer.id, 'Regu Reaksi Cepat UPTD', '2026-03-31');
      setActionSuccess(`Surat tugas ${rep.ticketCode} diterbitkan ke ${officer.name}!`);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleMarkComplete = (rep: RoadReport) => {
    updateReportStatus(rep.id, 'Selesai', 'Pekerjaan dinyatakan selesai tuntas dan jalan layak dilalui.');
    setActionSuccess(`Status ${rep.ticketCode} diubah menjadi Selesai!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            10. Sistem Informasi Geografis (GIS)
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Peta GIS Laporan Kerusakan Jalan Admin
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Visualisasi spasial seluruh titik pengaduan jalan rusak se-Kota Palembang dengan manajemen tindakan langsung.
          </p>
        </div>

        {actionSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        )}
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
          <Filter className="w-4 h-4 text-amber-600" />
          <span>Layer Filter:</span>
        </div>

        <div>
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Wilayah Kecamatan</option>
            {PALEMBANG_DISTRICTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Urgensi</option>
            <option value="Berat">Berat (Darurat)</option>
            <option value="Sedang">Sedang</option>
            <option value="Ringan">Ringan</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Diverifikasi">Diverifikasi</option>
            <option value="Ditugaskan">Ditugaskan</option>
            <option value="Dalam Perbaikan">Dalam Perbaikan</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div className="text-xs text-neutral-500 font-mono ml-auto">
          Menampilkan <strong className="text-neutral-900 tabular-nums">{filteredReports.length}</strong> titik aktif
        </div>
      </div>

      {/* Main Map + Selected Point Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Map View */}
        <div className="lg:col-span-8 bg-white p-2 rounded-2xl border border-neutral-200 shadow-xs">
          <PalembangMap
            reports={filteredReports}
            height="560px"
            onReportClick={(rep) => setSelectedReport(rep)}
            filterDistrict={filterDistrict}
            filterSeverity={filterSeverity}
          />
        </div>

        {/* Right Point Detail & Quick Disposisi Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          {selectedReport ? (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="text-xs font-mono font-bold text-amber-700">
                  {selectedReport.ticketCode}
                </div>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  selectedReport.status === 'Selesai'
                    ? 'bg-emerald-50 text-emerald-700'
                    : selectedReport.status === 'Dalam Perbaikan'
                    ? 'bg-blue-50 text-blue-700'
                    : selectedReport.status === 'Ditugaskan'
                    ? 'bg-purple-50 text-purple-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {selectedReport.status}
                </span>
              </div>

              {/* Photo Preview */}
              <div className="relative h-40 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                <img
                  src={selectedReport.photoBefore}
                  alt={selectedReport.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Kec. {selectedReport.district}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                  {selectedReport.roadName}
                </h3>
                <p className="text-xs text-neutral-600">
                  {selectedReport.title}
                </p>
                <div className="text-[11px] text-neutral-500 pt-1">
                  Patokan: {selectedReport.locationLandmark}
                </div>
              </div>

              {/* Coordinates */}
              <div className="p-2.5 bg-neutral-50 rounded-lg text-xs font-mono text-neutral-600 flex justify-between">
                <span>Latitude: {selectedReport.latitude.toFixed(5)}</span>
                <span>Longitude: {selectedReport.longitude.toFixed(5)}</span>
              </div>

              {/* Reporter Info */}
              <div className="text-xs border-t border-neutral-100 pt-3 space-y-1">
                <div className="text-neutral-500">Pelapor Warga:</div>
                <div className="font-semibold text-neutral-800">
                  {selectedReport.reporterName} ({selectedReport.reporterPhone})
                </div>
              </div>

              {/* Quick Actions for Admin */}
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <div className="text-xs font-bold text-neutral-800 mb-1">
                  Tindakan Cepat Admin:
                </div>
                {selectedReport.status === 'Menunggu Verifikasi' && (
                  <button
                    onClick={() => handleVerify(selectedReport)}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verifikasi Laporan Ini</span>
                  </button>
                )}
                {['Menunggu Verifikasi', 'Diverifikasi'].includes(selectedReport.status) && (
                  <button
                    onClick={() => handleQuickAssign(selectedReport)}
                    className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Disposisikan ke Tim UPTD</span>
                  </button>
                )}
                {selectedReport.status === 'Dalam Perbaikan' && (
                  <button
                    onClick={() => handleMarkComplete(selectedReport)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Tandai Selesai Diperbaiki</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedTicket(selectedReport.ticketCode);
                    setActivePage('status_laporan');
                  }}
                  className="w-full py-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <span>Buka Audit Lengkap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-400">
              Klik pada salah satu marker di peta untuk melihat rincian lokasi dan tindakan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
