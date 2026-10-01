import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { PhpSourceViewerModal } from './components/PhpSourceViewerModal';
import { ExcelDatabaseModal } from './components/ExcelDatabaseModal';

// 13 Pages
import { HalamanLogin } from './pages/HalamanLogin';
import { DashboardMasyarakat } from './pages/DashboardMasyarakat';
import { FormulirLaporJalan } from './pages/FormulirLaporJalan';
import { HalamanStatusLaporan } from './pages/HalamanStatusLaporan';
import { DashboardPetugas } from './pages/DashboardPetugas';
import { HalamanDaftarLaporanPetugas } from './pages/HalamanDaftarLaporanPetugas';
import { HalamanSebaranJalanRusak } from './pages/HalamanSebaranJalanRusak';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { HalamanStatistikAdmin } from './pages/HalamanStatistikAdmin';
import { HalamanPetaAdmin } from './pages/HalamanPetaAdmin';
import { HalamanTambahDataJalanAdmin } from './pages/HalamanTambahDataJalanAdmin';
import { HalamanKelolaLaporanAdmin } from './pages/HalamanKelolaLaporanAdmin';
import { HalamanPengelolaanPenggunaAdmin } from './pages/HalamanPengelolaanPenggunaAdmin';

import { 
  Building2, 
  Code, 
  MapPin, 
  Phone, 
  Mail, 
  RotateCcw
} from 'lucide-react';

const REQUIRED_PAGES = [
  { id: 'login', num: '1', title: 'Login' },
  { id: 'dashboard_masyarakat', num: '2', title: 'Dashboard Masyarakat' },
  { id: 'formulir_lapor', num: '3', title: 'Formulir Lapor' },
  { id: 'status_laporan', num: '4', title: 'Status Laporan' },
  { id: 'dashboard_petugas', num: '5', title: 'Dashboard Petugas' },
  { id: 'petugas_daftar_laporan', num: '6', title: 'Daftar Laporan Petugas' },
  { id: 'sebaran_jalan', num: '7', title: 'Sebaran Jalan Rusak' },
  { id: 'dashboard_admin', num: '8', title: 'Dashboard Admin' },
  { id: 'admin_statistik', num: '9', title: 'Statistik & Grafik Admin' },
  { id: 'admin_peta', num: '10', title: 'Peta Laporan Admin' },
  { id: 'admin_tambah_jalan', num: '11', title: 'Tambah Data Jalan Admin' },
  { id: 'admin_kelola_laporan', num: '12', title: 'Kelola Laporan Admin' },
  { id: 'admin_users', num: '13', title: 'Pengelolaan Pengguna Admin' },
];

const MainContent: React.FC = () => {
  const { activePage, setActivePage, setShowPhpModal, resetAllData } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'login':
        return <HalamanLogin />;
      case 'dashboard_masyarakat':
        return <DashboardMasyarakat />;
      case 'formulir_lapor':
        return <FormulirLaporJalan />;
      case 'status_laporan':
        return <HalamanStatusLaporan />;
      case 'dashboard_petugas':
        return <DashboardPetugas />;
      case 'petugas_daftar_laporan':
        return <HalamanDaftarLaporanPetugas />;
      case 'sebaran_jalan':
        return <HalamanSebaranJalanRusak />;
      case 'dashboard_admin':
        return <DashboardAdmin />;
      case 'admin_statistik':
        return <HalamanStatistikAdmin />;
      case 'admin_peta':
        return <HalamanPetaAdmin />;
      case 'admin_tambah_jalan':
        return <HalamanTambahDataJalanAdmin />;
      case 'admin_kelola_laporan':
        return <HalamanKelolaLaporanAdmin />;
      case 'admin_users':
        return <HalamanPengelolaanPenggunaAdmin />;
      default:
        return <DashboardMasyarakat />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100/60 text-neutral-900">
      <Navbar />

      {/* 13-Module Direct Access Navigator Bar */}
      <div className="bg-white border-b border-neutral-200 py-2 px-4 shadow-xs overflow-x-auto print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Navigasi 13 Halaman:</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {REQUIRED_PAGES.map((page) => (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id)}
                className={`px-2.5 py-1 rounded text-xs transition-all whitespace-nowrap flex items-center gap-1 shrink-0 ${
                  activePage === page.id
                    ? 'bg-neutral-900 text-white font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                title={page.title}
              >
                <span className={`font-mono text-[10px] ${activePage === page.id ? 'text-amber-400' : 'text-neutral-400'}`}>
                  {page.num}.
                </span>
                <span>{page.title}</span>
              </button>
            ))}
          </div>

          <button
            onClick={resetAllData}
            className="hidden xl:flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
            title="Kembalikan data ke awal"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1">
        {renderActivePage()}
      </main>

      {/* Official Government Footer */}
      <footer className="bg-neutral-950 text-neutral-400 text-xs py-10 border-t border-neutral-800 print:hidden mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="text-white font-bold text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                <span>SIPELAJAR Kota Palembang</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Sistem Informasi Pelaporan Jalan Rusak terpadu Pemerintah Kota Palembang dikelola oleh Dinas Pekerjaan Umum dan Penataan Ruang (PUPR).
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-white font-semibold text-xs uppercase tracking-wider">
                Alamat Kantor
              </div>
              <p className="text-neutral-400 leading-relaxed flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Jl. Slamet Riyadi No. 1, 11 Ilir, Kec. Ilir Timur II, Kota Palembang, Sumatera Selatan 30111</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-white font-semibold text-xs uppercase tracking-wider">
                Layanan & Bantuan
              </div>
              <div className="space-y-1 text-neutral-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>(0711) 351020 / Hotline WA: 0812-7100-PUPR</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>pupr@palembang.go.id</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-white font-semibold text-xs uppercase tracking-wider">
                Pengembang & Source Code
              </div>
              <p className="text-neutral-400 text-xs">
                Dilengkapi arsitektur kode lengkap PHP Native & MySQLi untuk seluruh modul.
              </p>
              <button
                onClick={() => setShowPhpModal(true)}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Buka Source Code PHP & MySQL</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-neutral-400 text-[11px] gap-2">
            <div>
              &copy; {new Date().getFullYear()} Dinas PUPR Pemerintah Kota Palembang. Hak Cipta Dilindungi Undang-Undang.
            </div>
            <div className="flex items-center gap-4">
              <span>Transparansi Publik</span>
              <span>•</span>
              <span>SPK Elektronik</span>
              <span>•</span>
              <span>Palembang Maju Bersama</span>
            </div>
          </div>
        </div>
      </footer>

      {/* PHP Source Code Modal */}
      <PhpSourceViewerModal />

      {/* Excel & Database Management Modal */}
      <ExcelDatabaseModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
