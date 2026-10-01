import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Building2, 
  UserCheck, 
  LogOut, 
  Code, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  Layers,
  MapPin,
  ClipboardList,
  BarChart3,
  Users
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activePage, 
    setActivePage, 
    loginAs, 
    logout, 
    setShowPhpModal,
    setShowExcelDbModal
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Nav links based on current role
  const getNavLinks = () => {
    if (!currentUser || currentUser.role === 'masyarakat') {
      return [
        { id: 'dashboard_masyarakat', label: 'Beranda' },
        { id: 'formulir_lapor', label: 'Lapor Jalan' },
        { id: 'status_laporan', label: 'Lacak Status' },
        { id: 'sebaran_jalan', label: 'Peta Sebaran' },
      ];
    }
    if (currentUser.role === 'petugas') {
      return [
        { id: 'dashboard_petugas', label: 'Dashboard Petugas' },
        { id: 'petugas_daftar_laporan', label: 'Daftar Tugas' },
        { id: 'sebaran_jalan', label: 'Peta Sebaran' },
        { id: 'status_laporan', label: 'Audit Laporan' },
      ];
    }
    // Admin
    return [
      { id: 'dashboard_admin', label: 'Dashboard Admin' },
      { id: 'admin_kelola_laporan', label: 'Kelola Laporan' },
      { id: 'admin_peta', label: 'Peta GIS' },
      { id: 'admin_statistik', label: 'Statistik' },
      { id: 'admin_tambah_jalan', label: 'Data Ruas' },
      { id: 'admin_users', label: 'Pengguna' },
    ];
  };

  const navLinks = getNavLinks();

  const handleRoleSelect = (role: UserRole) => {
    loginAs(role);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Role Quick Bar for easy review */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-1.5 px-4 sm:px-8 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-medium text-neutral-200">Dinas PUPR Kota Palembang</span>
          <span className="text-neutral-500">|</span>
          <span className="hidden sm:inline text-neutral-400">Sistem Pelaporan Jalan Rusak (SIPELAJAR)</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowExcelDbModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors"
            title="Kelola Excel & Database SQL"
          >
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>Excel & Database</span>
          </button>

          <button
            onClick={() => setShowPhpModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-colors"
          >
            <Code className="w-3 h-3" />
            <span>Lihat Source PHP</span>
          </button>

          {/* Quick role switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              <span>Peran:</span>
              <span className="font-semibold text-amber-400 capitalize">
                {currentUser ? currentUser.role : 'Belum Login'}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-neutral-200 py-1 z-50 text-neutral-800">
                <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                  Ganti Hak Akses Akun:
                </div>
                <button
                  onClick={() => handleRoleSelect('masyarakat')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-100 ${
                    currentUser?.role === 'masyarakat' ? 'bg-amber-50 text-amber-900 font-semibold' : ''
                  }`}
                >
                  <span>1. Warga / Masyarakat</span>
                  {currentUser?.role === 'masyarakat' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                </button>
                <button
                  onClick={() => handleRoleSelect('petugas')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-100 ${
                    currentUser?.role === 'petugas' ? 'bg-amber-50 text-amber-900 font-semibold' : ''
                  }`}
                >
                  <span>2. Petugas Lapangan PUPR</span>
                  {currentUser?.role === 'petugas' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                </button>
                <button
                  onClick={() => handleRoleSelect('admin')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-100 ${
                    currentUser?.role === 'admin' ? 'bg-amber-50 text-amber-900 font-semibold' : ''
                  }`}
                >
                  <span>3. Administrator Sistem</span>
                  {currentUser?.role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => {
            if (currentUser?.role === 'admin') setActivePage('dashboard_admin');
            else if (currentUser?.role === 'petugas') setActivePage('dashboard_petugas');
            else setActivePage('dashboard_masyarakat');
          }}
          className="text-left group cursor-pointer flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-black text-sm">
            PLB
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-amber-600 transition-colors">
              SIPELAJAR
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-neutral-500">Kota Palembang</span>
          </div>
        </button>

        {/* Zone 2: clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`text-sm font-medium transition-colors relative py-1 ${
                activePage === link.id
                  ? 'text-neutral-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: primary actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {currentUser.role === 'masyarakat' && (
                <button
                  onClick={() => setActivePage('formulir_lapor')}
                  className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                >
                  + Lapor Jalan Rusak
                </button>
              )}
              <button
                onClick={() => logout()}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-colors whitespace-nowrap"
                title="Keluar akun"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setActivePage('login')}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap"
            >
              Masuk Portal
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
            Menu Navigasi
          </div>
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActivePage(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activePage === link.id
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setShowPhpModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg border border-amber-200"
            >
              Buka Source Code PHP & MySQL
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg"
              >
                Keluar Akun ({currentUser.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
