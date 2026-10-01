import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  HardHat, 
  ArrowRight, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { ASSET_HERO } from '../data/initialData';

export const HalamanLogin: React.FC = () => {
  const { loginAs, setActivePage } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('masyarakat');
  const [email, setEmail] = useState('warga@palembang.go.id');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleRolePreset = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'masyarakat') {
      setEmail('warga@palembang.go.id');
      setPassword('password123');
    } else if (role === 'petugas') {
      setEmail('petugas@pupr.palembang.go.id');
      setPassword('petugas123');
    } else {
      setEmail('admin@pupr.palembang.go.id');
      setPassword('admin123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Harap masukkan email dan kata sandi.');
      return;
    }
    setError(null);
    loginAs(selectedRole);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-100/60">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        
        {/* Left Visual Column */}
        <div className="lg:col-span-5 bg-neutral-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-25">
            <img 
              src={ASSET_HERO} 
              alt="Palembang Urban Infrastructure" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/80 to-transparent"></div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-medium backdrop-blur-xs border border-white/10">
              <Building2 className="w-3.5 h-3.5" />
              <span>Dinas PUPR Kota Palembang</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
              Sistem Informasi Pelaporan Jalan Rusak
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Platform transparansi layanan aduan infrastruktur jalan raya Kota Palembang untuk percepatan perbaikan jalan dan keselamatan berkendara masyarakat.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 space-y-2 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pelaporan instan dengan GPS & foto jalan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pelacakan status pengerjaan secara real-time</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Integrasi tim reaksi cepat UPTD PUPR</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-neutral-900">1. Masuk ke Portal</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Pilih salah satu peran pengguna untuk mencoba fungsionalitas sistem.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleRolePreset('masyarakat')}
              className={`py-2 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'masyarakat'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Masyarakat</span>
            </button>

            <button
              type="button"
              onClick={() => handleRolePreset('petugas')}
              className={`py-2 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'petugas'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>Petugas PUPR</span>
            </button>

            <button
              type="button"
              onClick={() => handleRolePreset('admin')}
              className={`py-2 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dinas</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Alamat Email Pengguna
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Masuk Sebagai {selectedRole === 'masyarakat' ? 'Masyarakat' : selectedRole === 'petugas' ? 'Petugas Lapangan' : 'Administrator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
            <span>Mau cek status aduan tanpa login?</span>
            <button
              onClick={() => setActivePage('status_laporan')}
              className="text-amber-600 font-semibold hover:underline"
            >
              Lacak Nomor Tiket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
