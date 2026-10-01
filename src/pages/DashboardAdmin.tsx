import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Layers, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  BarChart3, 
  Users, 
  FileText, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  Map
} from 'lucide-react';

export const DashboardAdmin: React.FC = () => {
  const { currentUser, reports, roads, users, setActivePage, setSelectedTicket } = useApp();

  const totalReports = reports.length;
  const pendingVerify = reports.filter(r => r.status === 'Menunggu Verifikasi').length;
  const assigned = reports.filter(r => r.status === 'Ditugaskan').length;
  const inProgress = reports.filter(r => r.status === 'Dalam Perbaikan').length;
  const completed = reports.filter(r => r.status === 'Selesai').length;
  const rejected = reports.filter(r => r.status === 'Ditolak').length;

  const totalRoadLength = roads.reduce((acc, r) => acc + r.lengthKm, 0);
  const severeReports = reports.filter(r => r.severity === 'Berat' && r.status !== 'Selesai');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Executive Header */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-neutral-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>8. Dashboard Administrator Dinas PUPR Kota Palembang</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Pusat Komando & Pengendalian Jalan Kota
          </h1>
          <p className="text-xs text-neutral-300 max-w-xl">
            Sistem Informasi Pengawasan dan Pelaporan Kerusakan Jalan (SIPELAJAR). Memantau integritas {roads.length} ruas jalan utama Kota Palembang secara terintegrasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActivePage('admin_kelola_laporan')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors shadow-xs"
          >
            Verifikasi Aduan ({pendingVerify})
          </button>
          <button
            onClick={() => setActivePage('admin_peta')}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg text-xs transition-colors border border-neutral-700 flex items-center gap-1.5"
          >
            <Map className="w-4 h-4 text-amber-400" />
            <span>Peta GIS Admin</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Tabular-nums, Anti-slop) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-[11px] font-medium text-neutral-500 mb-1">Total Laporan</div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">{totalReports}</div>
          <div className="text-[10px] text-neutral-400 mt-1">Keseluruhan aduan</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-[11px] font-medium text-neutral-500 mb-1">Butuh Verifikasi</div>
          <div className="text-2xl font-bold text-amber-600 tabular-nums">{pendingVerify}</div>
          <div className="text-[10px] text-amber-700 mt-1">Perlu disposisi segera</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-[11px] font-medium text-neutral-500 mb-1">Ditugaskan</div>
          <div className="text-2xl font-bold text-purple-600 tabular-nums">{assigned}</div>
          <div className="text-[10px] text-neutral-400 mt-1">Surat tugas regu UPTD</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-[11px] font-medium text-neutral-500 mb-1">Dalam Perbaikan</div>
          <div className="text-2xl font-bold text-blue-600 tabular-nums">{inProgress}</div>
          <div className="text-[10px] text-neutral-400 mt-1">Pengerjaan hotmix aktif</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-[11px] font-medium text-neutral-500 mb-1">Tuntas Selesai</div>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums">{completed}</div>
          <div className="text-[10px] text-emerald-700 mt-1">Telah diuji kelayakan</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-[11px] font-medium text-neutral-500 mb-1">Panjang Ruas Kota</div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">{totalRoadLength.toFixed(1)} <span className="text-xs font-normal text-neutral-500">km</span></div>
          <div className="text-[10px] text-neutral-400 mt-1">Jalan terinventarisasi</div>
        </div>
      </div>

      {/* Quick Navigation Modules for Admin */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setActivePage('admin_kelola_laporan')}
          className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-amber-500 transition-all text-left shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mb-2 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-neutral-900">Kelola Laporan</div>
          <div className="text-[11px] text-neutral-500">Verifikasi & Disposisi</div>
        </button>

        <button
          onClick={() => setActivePage('admin_statistik')}
          className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-amber-500 transition-all text-left shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-neutral-900">Statistik & Grafik</div>
          <div className="text-[11px] text-neutral-500">Analisis tren kerusakan</div>
        </button>

        <button
          onClick={() => setActivePage('admin_peta')}
          className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-amber-500 transition-all text-left shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Map className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-neutral-900">Peta Laporan GIS</div>
          <div className="text-[11px] text-neutral-500">Pemetaan spasial kota</div>
        </button>

        <button
          onClick={() => setActivePage('admin_tambah_jalan')}
          className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-amber-500 transition-all text-left shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-2 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-neutral-900">Master Data Jalan</div>
          <div className="text-[11px] text-neutral-500">Tambah ruas & wewenang</div>
        </button>

        <button
          onClick={() => setActivePage('admin_users')}
          className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-amber-500 transition-all text-left shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 mb-2 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-neutral-900">Kelola Pengguna</div>
          <div className="text-[11px] text-neutral-500">Petugas & Masyarakat</div>
        </button>
      </div>

      {/* Main Admin Section: Pending Verification Queue & Emergency Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Urgent & Pending Reports */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Antrean Laporan Prioritas Menunggu Verifikasi</span>
            </h2>
            <button
              onClick={() => setActivePage('admin_kelola_laporan')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <span>Buka Modul Disposisi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {reports.filter(r => r.status === 'Menunggu Verifikasi').length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-neutral-200 text-center text-neutral-500 text-xs">
                Tidak ada laporan pending. Semua aduan masyarakat telah diverifikasi!
              </div>
            ) : (
              reports.filter(r => r.status === 'Menunggu Verifikasi').map(rep => (
                <div
                  key={rep.id}
                  className="bg-white p-4 rounded-xl border border-neutral-200 hover:border-amber-300 transition-all shadow-xs flex flex-col sm:flex-row justify-between gap-4"
                >
                  <div className="flex gap-4">
                    {rep.photoBefore && (
                      <img
                        src={rep.photoBefore}
                        alt={rep.title}
                        className="w-16 h-16 rounded-lg object-cover border border-neutral-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="text-xs text-neutral-500 flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-700">{rep.ticketCode}</span>
                        <span>•</span>
                        <span>{rep.district}</span>
                        <span>•</span>
                        <span className="font-semibold text-red-600">Urgensi {rep.severity}</span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900">
                        {rep.roadName} — {rep.title}
                      </h4>
                      <p className="text-xs text-neutral-600 line-clamp-1">
                        {rep.locationLandmark}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between items-end gap-2 shrink-0">
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-800 rounded">
                      Menunggu Verifikasi
                    </span>
                    <button
                      onClick={() => setActivePage('admin_kelola_laporan')}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Verifikasi & Disposisi
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Dinas Performance & Resource Summary */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Indikator Kinerja Pelayanan (IKP)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-neutral-600 mb-1">
                  <span>Rasio Penyelesaian Laporan</span>
                  <span className="font-mono font-bold text-neutral-900">
                    {totalReports > 0 ? ((completed / totalReports) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${totalReports > 0 ? (completed / totalReports) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-600 mb-1">
                  <span>Rata-Rata Waktu Tanggap (Respon Cepat)</span>
                  <span className="font-mono font-bold text-neutral-900">3.2 Jam</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-600 mb-1">
                  <span>Ketersediaan Material Aspal Hotmix</span>
                  <span className="font-mono font-bold text-neutral-900">94 Ton Aman</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 text-white p-5 rounded-xl border border-neutral-800 space-y-2 text-xs">
            <div className="font-bold text-amber-400">Pemberitahuan Sistem Otomatis</div>
            <p className="text-neutral-300 leading-relaxed">
              Integrasi basis data master ruas jalan telah sinkron dengan standar SK Walikota Palembang Nomor 24/KPTS/PUPR/2025 tentang Jaringan Jalan Kota.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
