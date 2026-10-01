import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PALEMBANG_DISTRICTS } from '../data/initialData';
import { RoadReport, ReportStatus, DamageSeverity } from '../types';
import { exportReportsToExcel } from '../utils/excelExport';
import { 
  FileText, 
  Filter, 
  Search, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  Download, 
  Printer, 
  MapPin, 
  X, 
  AlertCircle,
  Eye,
  FileSpreadsheet,
  Upload
} from 'lucide-react';

export const HalamanKelolaLaporanAdmin: React.FC = () => {
  const { 
    reports, 
    users, 
    updateReportStatus, 
    assignReport, 
    rejectReport, 
    setSelectedTicket, 
    setActivePage,
    setShowExcelDbModal
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [severityFilter, setSeverityFilter] = useState('Semua');

  // Modals
  const [assignModalReport, setAssignModalReport] = useState<RoadReport | null>(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState(users.find(u => u.role === 'petugas')?.id || '');
  const [teamName, setTeamName] = useState('Regu UPTD Pemeliharaan Wilayah Ilir');
  const [targetDate, setTargetDate] = useState('2026-03-31');

  const [rejectModalReport, setRejectModalReport] = useState<RoadReport | null>(null);
  const [rejectReason, setRejectReason] = useState('Ruas jalan ini merupakan kewenangan Balai Besar Pelaksanaan Jalan Nasional (BBPJN) V / Provinsi Sumsel.');

  const officers = users.filter(u => u.role === 'petugas');

  const filteredReports = reports.filter(r => {
    if (districtFilter !== 'Semua' && r.district !== districtFilter) return false;
    if (statusFilter !== 'Semua' && r.status !== statusFilter) return false;
    if (severityFilter !== 'Semua' && r.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = r.ticketCode.toLowerCase().includes(q) ||
                    r.roadName.toLowerCase().includes(q) ||
                    r.reporterName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleVerifyDirect = (report: RoadReport) => {
    updateReportStatus(report.id, 'Diverifikasi', 'Laporan telah diverifikasi oleh Administrator Dinas PUPR Kota Palembang.');
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalReport) return;
    assignReport(assignModalReport.id, selectedOfficerId, teamName, targetDate);
    setAssignModalReport(null);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalReport) return;
    rejectReport(rejectModalReport.id, rejectReason);
    setRejectModalReport(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            12. Manajemen Pengaduan
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Kelola & Disposisi Laporan Jalan Rusak
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Verifikasi validitas aduan warga, terbitkan surat penugasan regu lapangan, dan audit tahapan penyelesaian perbaikan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExcelDbModal(true)}
            className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Buka Pusat Excel & Database"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Masukin dari Excel</span>
          </button>

          <button
            onClick={() => exportReportsToExcel(filteredReports)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Ekspor ke Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari kode tiket, nama jalan, nama pelapor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Kecamatan</option>
            {PALEMBANG_DISTRICTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Diverifikasi">Diverifikasi</option>
            <option value="Ditugaskan">Ditugaskan</option>
            <option value="Dalam Perbaikan">Dalam Perbaikan</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Urgensi</option>
            <option value="Berat">Berat (Darurat)</option>
            <option value="Sedang">Sedang</option>
            <option value="Ringan">Ringan</option>
          </select>
        </div>

        <div className="text-xs text-neutral-500 font-mono ml-auto">
          Ditemukan <strong className="text-neutral-900 tabular-nums">{filteredReports.length}</strong> data
        </div>
      </div>

      {/* Main Reports Management Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">No. Tiket & Tanggal</th>
                <th className="px-4 py-3">Ruas Jalan & Lokasi</th>
                <th className="px-4 py-3">Kategori & Urgensi</th>
                <th className="px-4 py-3">Pelapor Warga</th>
                <th className="px-4 py-3">Status Saat Ini</th>
                <th className="px-4 py-3">Petugas Lapangan</th>
                <th className="px-4 py-3 text-right">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredReports.map(rep => (
                <tr key={rep.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-amber-700">{rep.ticketCode}</div>
                    <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                      {new Date(rep.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-neutral-900">{rep.roadName}</div>
                    <div className="text-[11px] text-neutral-500 line-clamp-1">{rep.district} • {rep.locationLandmark}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-neutral-800">{rep.category}</div>
                    <span className={`inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-semibold ${
                      rep.severity === 'Berat' ? 'bg-red-50 text-red-700' : rep.severity === 'Sedang' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {rep.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{rep.reporterName}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">{rep.reporterPhone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      rep.status === 'Selesai'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : rep.status === 'Dalam Perbaikan'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : rep.status === 'Ditugaskan'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : rep.status === 'Ditolak'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {rep.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {rep.assignedOfficerName ? (
                      <div>
                        <div className="font-medium text-neutral-800">{rep.assignedOfficerName}</div>
                        <div className="text-[10px] text-neutral-400">{rep.workTeam}</div>
                      </div>
                    ) : (
                      <span className="text-neutral-400 italic">Belum Ditugaskan</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {rep.status === 'Menunggu Verifikasi' && (
                        <button
                          onClick={() => handleVerifyDirect(rep)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded text-[11px] transition-colors"
                          title="Verifikasi Teknis"
                        >
                          Verifikasi
                        </button>
                      )}
                      {['Menunggu Verifikasi', 'Diverifikasi'].includes(rep.status) && (
                        <button
                          onClick={() => setAssignModalReport(rep)}
                          className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-[11px] font-medium transition-colors"
                          title="Disposisikan ke Petugas"
                        >
                          Disposisi
                        </button>
                      )}
                      {['Menunggu Verifikasi', 'Diverifikasi'].includes(rep.status) && (
                        <button
                          onClick={() => setRejectModalReport(rep)}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-[11px] font-medium transition-colors"
                          title="Tolak Laporan"
                        >
                          Tolak
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedTicket(rep.ticketCode);
                          setActivePage('status_laporan');
                        }}
                        className="p-1 text-neutral-500 hover:text-neutral-900 rounded"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disposisi Modal */}
      {assignModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Disposisi Surat Perintah Tugas</h3>
              <button onClick={() => setAssignModalReport(null)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg space-y-1">
                <div className="font-mono text-amber-700 font-bold">{assignModalReport.ticketCode}</div>
                <div className="font-bold text-neutral-900">{assignModalReport.roadName}</div>
                <div className="text-neutral-500">{assignModalReport.title}</div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Pilih Petugas / Penanggung Jawab *</label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                  required
                >
                  {officers.map(off => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.assignedDistrict || 'Wilayah Palembang'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Nama Tim / Regu Kerja *</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Target Tanggal Selesai *</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                  required
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalReport(null)}
                  className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg shadow-xs"
                >
                  Kirim Surat Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-red-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Konfirmasi Penolakan / Pengalihan Laporan</h3>
              <button onClick={() => setRejectModalReport(null)} className="text-neutral-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="p-6 space-y-4 text-xs">
              <p className="text-neutral-600">
                Laporan ini akan ditandai <strong className="text-red-600">Ditolak</strong> dan pelapor akan melihat alasan berikut di halaman pelacakan status:
              </p>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Alasan Penolakan Resmi *</label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                  required
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalReport(null)}
                  className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Konfirmasi Tolak Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
