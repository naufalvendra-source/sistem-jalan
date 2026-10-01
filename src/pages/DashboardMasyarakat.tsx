import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  PhoneCall, 
  ShieldAlert,
  FileText
} from 'lucide-react';
import { ASSET_HERO } from '../data/initialData';

export const DashboardMasyarakat: React.FC = () => {
  const { 
    currentUser, 
    reports, 
    setActivePage, 
    setSelectedTicket 
  } = useApp();

  const [searchTicket, setSearchTicket] = useState('');

  // Filter reports submitted by current citizen or matching demo
  const myReports = reports.filter(r => 
    currentUser ? r.reporterName === currentUser.name || r.reporterPhone === currentUser.phone : true
  );

  const totalMyReports = myReports.length;
  const inProgress = myReports.filter(r => ['Diverifikasi', 'Ditugaskan', 'Dalam Perbaikan'].includes(r.status)).length;
  const completed = myReports.filter(r => r.status === 'Selesai').length;
  const pending = myReports.filter(r => r.status === 'Menunggu Verifikasi').length;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTicket.trim()) return;
    setSelectedTicket(searchTicket.trim().toUpperCase());
    setActivePage('status_laporan');
  };

  const handleSelectReport = (ticketCode: string) => {
    setSelectedTicket(ticketCode);
    setActivePage('status_laporan');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative rounded-2xl bg-neutral-900 text-white overflow-hidden p-6 sm:p-10 border border-neutral-800">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={ASSET_HERO} 
            alt="Palembang Urban Roads" 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/90 to-transparent"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            2. Dashboard Layanan Warga
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Selamat Datang, {currentUser?.name || 'Warga Palembang'}
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Laporkan jalan berlubang, amblas, dan drainase rusak di wilayah Kota Palembang. Laporan Anda langsung diteruskan ke UPTD Dinas PUPR untuk tindakan cepat perbaikan.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage('formulir_lapor')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Laporan Jalan Baru</span>
            </button>
            <button
              onClick={() => setActivePage('sebaran_jalan')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-xs transition-colors border border-white/20"
            >
              <MapPin className="w-4 h-4" />
              <span>Lihat Peta Sebaran Kerusakan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Tracker Bar */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Lacak Pengaduan Secara Langsung</h3>
            <p className="text-xs text-neutral-500">Punya kode tiket seperti PLB-2026-8912? Cek status perbaikan di sini.</p>
          </div>
        </div>

        <form onSubmit={handleTrackSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Contoh: PLB-2026-8912"
            value={searchTicket}
            onChange={(e) => setSearchTicket(e.target.value)}
            className="px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-56 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors shrink-0"
          >
            Lacak
          </button>
        </form>
      </div>

      {/* Metric Cards (Anti-slop: clean, unboxed, tabular-nums) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 mb-1">Total Aduan Saya</div>
          <div className="text-3xl font-bold text-neutral-900 tabular-nums">{totalMyReports}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Teregistrasi di sistem</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 mb-1">Menunggu Verifikasi</div>
          <div className="text-3xl font-bold text-amber-600 tabular-nums">{pending}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Antrean tim teknis PUPR</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 mb-1">Sedang Dikerjakan</div>
          <div className="text-3xl font-bold text-blue-600 tabular-nums">{inProgress}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Regu UPTD di lapangan</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 mb-1">Tuntas Diperbaiki</div>
          <div className="text-3xl font-bold text-emerald-600 tabular-nums">{completed}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Jalan aman dilalui</div>
        </div>
      </div>

      {/* Main Content Area: Left My Reports List, Right Service Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Citizen Reports */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              Riwayat Pengaduan Jalan Saya
            </h2>
            <button
              onClick={() => setActivePage('status_laporan')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <span>Buka Halaman Status Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myReports.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-neutral-300 p-8 text-center space-y-3">
              <FileText className="w-10 h-10 text-neutral-400 mx-auto" />
              <div className="text-sm font-semibold text-neutral-800">Belum Ada Laporan Jalan</div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Bila Anda menemukan jalan rusak, berlubang, atau amblas di Palembang, segera laporkan agar masuk jadwal perbaikan dinas.
              </p>
              <button
                onClick={() => setActivePage('formulir_lapor')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Laporan Pertama</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all shadow-xs flex flex-col sm:flex-row gap-4 justify-between"
                >
                  <div className="flex gap-4">
                    {report.photoBefore && (
                      <img
                        src={report.photoBefore}
                        alt={report.title}
                        className="w-20 h-20 rounded-lg object-cover border border-neutral-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="text-xs text-neutral-500 flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-700">{report.ticketCode}</span>
                        <span>•</span>
                        <span>{report.district}</span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 line-clamp-1">
                        {report.roadName} — {report.title}
                      </h4>
                      <p className="text-xs text-neutral-600 line-clamp-1">
                        {report.locationLandmark}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>•</span>
                        <span className="font-medium text-neutral-700">Tingkat {report.severity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between items-end sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      report.status === 'Selesai'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : report.status === 'Dalam Perbaikan'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : report.status === 'Ditugaskan'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : report.status === 'Ditolak'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {report.status}
                    </span>
                    <button
                      onClick={() => handleSelectReport(report.ticketCode)}
                      className="text-xs text-neutral-700 hover:text-amber-700 font-semibold flex items-center gap-1 py-1"
                    >
                      <span>Detail Progres</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Civic Guidance & Emergency Hotline */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Pedoman Lapor Jalan Rusak</span>
            </h3>
            <ul className="text-xs text-neutral-600 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-700">1.</span>
                <span>Pastikan lokasi berada di ruas jalan wilayah Kota Palembang (Kewenangan Kota / Provinsi).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-700">2.</span>
                <span>Ambil foto kerusakan jalan dari sudut pandang yang jelas dan aman dari arus lalu lintas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-700">3.</span>
                <span>Sertakan patokan spesifik seperti nomor toko, nama halte, tiang listrik, atau simpang terdekat.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-700">4.</span>
                <span>Simpan nomor tiket Anda untuk memantau waktu tim dinas tiba di lokasi penanganan.</span>
              </li>
            </ul>
          </div>

          <div className="bg-neutral-900 text-white p-5 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <PhoneCall className="w-4 h-4" />
              <span>Kontak Darurat Dinas PUPR Palembang</span>
            </div>
            <p className="text-xs text-neutral-300">
              Untuk jalan ambles darurat atau pohon tumbang yang memutus arus jalan protokol:
            </p>
            <div className="font-mono text-sm font-bold text-white bg-neutral-800 p-2.5 rounded-lg border border-neutral-700">
              Hotline: (0711) 351020 / WA 0812-7100-PUPR
            </div>
            <div className="text-[11px] text-neutral-400">
              Pelayanan Pengaduan 24 Jam UPTD Reaksi Cepat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
