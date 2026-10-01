import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, AppUser } from '../types';
import { PALEMBANG_DISTRICTS } from '../data/initialData';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ShieldCheck, 
  HardHat, 
  User, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  X, 
  Key, 
  Mail, 
  Phone 
} from 'lucide-react';

export const HalamanPengelolaanPenggunaAdmin: React.FC = () => {
  const { users, addUser, toggleUserStatus, deleteUser, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('petugas');
  const [nikOrNip, setNikOrNip] = useState('');
  const [assignedDistrict, setAssignedDistrict] = useState(PALEMBANG_DISTRICTS[0]);
  const [agency, setAgency] = useState('UPTD Pemeliharaan Jalan Dinas PUPR Kota Palembang');

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'Semua' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q) ||
                    u.phone.toLowerCase().includes(q) ||
                    u.nikOrNip?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name,
      email,
      phone,
      role,
      nikOrNip,
      assignedDistrict,
      agency,
      status: 'Aktif',
    });

    setNotification(`Akun ${role} atas nama "${name}" berhasil ditambahkan ke sistem.`);
    setName('');
    setEmail('');
    setPhone('');
    setNikOrNip('');
    setShowAddModal(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetPassword = (u: AppUser) => {
    setNotification(`Instruksi reset kata sandi telah dikirim ke email ${u.email}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            13. Manajemen Akses & Keamanan
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Pengelolaan Pengguna Sistem (Multi-Role)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manajemen hak akses akun masyarakat pelapor, tim teknis petugas lapangan UPTD, dan administrator dinas.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari nama, email, NIK/NIP, nomor HP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Peran ({users.length})</option>
            <option value="masyarakat">Masyarakat Warga ({users.filter(u => u.role === 'masyarakat').length})</option>
            <option value="petugas">Petugas Lapangan PUPR ({users.filter(u => u.role === 'petugas').length})</option>
            <option value="admin">Administrator Dinas ({users.filter(u => u.role === 'admin').length})</option>
          </select>
        </div>

        <div className="text-xs text-neutral-500 font-mono ml-auto">
          Ditemukan <strong className="text-neutral-900 tabular-nums">{filteredUsers.length}</strong> pengguna
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Nama Pengguna</th>
                <th className="px-4 py-3">Peran (Role)</th>
                <th className="px-4 py-3">Kontak & Email</th>
                <th className="px-4 py-3">NIP / NIK</th>
                <th className="px-4 py-3">Wilayah Tugas / Instansi</th>
                <th className="px-4 py-3">Status Akun</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-neutral-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0 font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div>{user.name}</div>
                        {currentUser?.id === user.id && (
                          <span className="text-[10px] text-amber-700 font-semibold">(Anda Sedang Login)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-neutral-900 text-white' 
                        : user.role === 'petugas' 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {user.role === 'admin' && <ShieldCheck className="w-3 h-3 text-amber-400" />}
                      {user.role === 'petugas' && <HardHat className="w-3 h-3 text-amber-700" />}
                      {user.role === 'masyarakat' && <User className="w-3 h-3 text-neutral-600" />}
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-neutral-800">{user.email}</div>
                    <div className="text-neutral-500 font-mono text-[11px]">{user.phone}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-neutral-600">
                    {user.nikOrNip || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-neutral-800 font-medium">{user.assignedDistrict || '-'}</div>
                    <div className="text-[10px] text-neutral-400">{user.agency}</div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        user.status === 'Aktif'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                      title="Klik untuk ubah status"
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded"
                        title="Reset Sandi"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>
                      {currentUser?.id !== user.id && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Tambah Pengguna Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-medium text-neutral-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Rahmat Hidayat, S.T."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Email Pengguna *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@palembang.go.id"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Nomor HP / WhatsApp *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Peran / Hak Akses *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-semibold"
                  >
                    <option value="petugas">Petugas Lapangan PUPR</option>
                    <option value="admin">Administrator Dinas PUPR</option>
                    <option value="masyarakat">Masyarakat Warga</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">NIP Pegawai / NIK KTP</label>
                  <input
                    type="text"
                    value={nikOrNip}
                    onChange={(e) => setNikOrNip(e.target.value)}
                    placeholder="1988xxxx xxxx..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Wilayah Penugasan Kecamatan</label>
                  <select
                    value={assignedDistrict}
                    onChange={(e) => setAssignedDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                  >
                    {PALEMBANG_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Instansi / Unit Kerja</label>
                  <input
                    type="text"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg shadow-xs"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
