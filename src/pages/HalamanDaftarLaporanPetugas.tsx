import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PALEMBANG_DISTRICTS, ASSET_REPAIRED } from '../data/initialData';
import { RoadReport, ReportStatus, DamageSeverity } from '../types';
import { 
  Wrench, 
  Filter, 
  Camera, 
  Upload, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  X, 
  FileCheck2,
  HardHat
} from 'lucide-react';

export const HalamanDaftarLaporanPetugas: React.FC = () => {
  const { reports, updateReportStatus, setActivePage, setSelectedTicket } = useApp();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('Semua');

  // Modal update state
  const [activeTaskModal, setActiveTaskModal] = useState<RoadReport | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>('Dalam Perbaikan');
  const [notes, setNotes] = useState('');
  const [materialVolume, setMaterialVolume] = useState('Aspal Hotmix AC-WC 6 Ton & Tack Coat');
  const [photoAfterBase64, setPhotoAfterBase64] = useState<string>(ASSET_REPAIRED);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter reports
  const filteredReports = reports.filter(r => {
    if (selectedDistrict !== 'Semua' && r.district !== selectedDistrict) return false;
    if (selectedStatus !== 'Semua' && r.status !== selectedStatus) return false;
    if (selectedSeverity !== 'Semua' && r.severity !== selectedSeverity) return false;
    return true;
  });

  const handleOpenModal = (task: RoadReport) => {
    setActiveTaskModal(task);
    if (task.status === 'Ditugaskan') {
      setNewStatus('Dalam Perbaikan');
      setNotes('Tim UPTD tiba di lokasi jalan. Pemasangan barikade keselamatan dan pemotongan aspal dimulai.');
    } else if (task.status === 'Dalam Perbaikan') {
      setNewStatus('Selesai');
      setNotes('Penghamparan aspal hotmix dan pemadatan roller selesai tuntas. Kerataan jalan telah diuji.');
    } else {
      setNewStatus(task.status);
      setNotes('');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoAfterBase64(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTaskModal) return;

    setIsUpdating(true);
    updateReportStatus(
      activeTaskModal.id,
      newStatus,
      notes || `Update status lapangan ke ${newStatus}`,
      newStatus === 'Selesai' ? photoAfterBase64 : undefined,
      materialVolume
    );

    setTimeout(() => {
      setIsUpdating(false);
      setActiveTaskModal(null);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            6. Modul Lapangan
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Daftar Laporan Tugas Petugas Lapangan
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Eksekusi surat perintah tugas penambalan jalan, catat pemakaian aspal, dan unggah foto bukti perbaikan.
          </p>
        </div>

        <div className="text-xs font-mono bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-lg self-start sm:self-auto">
          Total Tugas: <strong className="text-neutral-900 tabular-nums">{filteredReports.length}</strong> Lokasi
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 mr-2">
          <Filter className="w-4 h-4 text-amber-600" />
          <span>Filter Laporan:</span>
        </div>

        <div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Kecamatan ({PALEMBANG_DISTRICTS.length})</option>
            {PALEMBANG_DISTRICTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Ditugaskan">Ditugaskan</option>
            <option value="Dalam Perbaikan">Dalam Perbaikan</option>
            <option value="Selesai">Selesai</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
          </select>
        </div>

        <div>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Tingkat Keparahan</option>
            <option value="Berat">Berat (Darurat)</option>
            <option value="Sedang">Sedang</option>
            <option value="Ringan">Ringan</option>
          </select>
        </div>

        {(selectedDistrict !== 'Semua' || selectedStatus !== 'Semua' || selectedSeverity !== 'Semua') && (
          <button
            onClick={() => {
              setSelectedDistrict('Semua');
              setSelectedStatus('Semua');
              setSelectedSeverity('Semua');
            }}
            className="text-xs text-red-600 hover:underline font-medium ml-auto"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map(task => (
          <div
            key={task.id}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Photo & Status Header */}
              <div className="relative h-44 bg-neutral-100 overflow-hidden">
                <img
                  src={task.photoBefore}
                  alt={task.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-neutral-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                  {task.ticketCode}
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 text-[11px] font-bold rounded shadow-xs ${
                    task.status === 'Selesai'
                      ? 'bg-emerald-500 text-white'
                      : task.status === 'Dalam Perbaikan'
                      ? 'bg-blue-600 text-white'
                      : task.status === 'Ditugaskan'
                      ? 'bg-purple-600 text-white'
                      : 'bg-amber-500 text-neutral-950'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{task.district}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-700">{task.category}</span>
                  <span>•</span>
                  <span className={`font-semibold ${
                    task.severity === 'Berat' ? 'text-red-600' : task.severity === 'Sedang' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    Urgensi {task.severity}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">
                  {task.roadName}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2">
                  {task.locationLandmark}
                </p>
                <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-100 flex items-center justify-between">
                  <span>Pelapor: {task.reporterName}</span>
                  <span className="font-mono">{new Date(task.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-4 bg-neutral-50/70 border-t border-neutral-200 flex items-center gap-2">
              <button
                onClick={() => handleOpenModal(task)}
                className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Update Progres Lapangan</span>
              </button>
              <button
                onClick={() => {
                  setSelectedTicket(task.ticketCode);
                  setActivePage('status_laporan');
                }}
                className="py-2 px-3 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-lg text-xs font-medium transition-colors"
                title="Lihat Detail Audit"
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Update Progres Lapangan */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-xl overflow-hidden animate-in fade-in duration-150">
            
            <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-400 font-mono">
                  {activeTaskModal.ticketCode} • Kec. {activeTaskModal.district}
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Update Pengerjaan: {activeTaskModal.roadName}
                </h3>
              </div>
              <button
                onClick={() => setActiveTaskModal(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Pembaruan Status Penanganan *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  required
                >
                  <option value="Dalam Perbaikan">Dalam Perbaikan (Sedang Dikerjakan di Lapangan)</option>
                  <option value="Selesai">Selesai (Pengerjaan Tuntas 100%)</option>
                  <option value="Ditugaskan">Ditugaskan (Menunggu Jadwal Lapangan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Estimasi / Realisasi Volume Material Aspal
                </label>
                <input
                  type="text"
                  value={materialVolume}
                  onChange={(e) => setMaterialVolume(e.target.value)}
                  placeholder="Contoh: Aspal Hotmix AC-WC 8 Ton, Tack Coat 20 Liter"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Upload Foto Selesai bila status Selesai */}
              {newStatus === 'Selesai' && (
                <div className="space-y-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <label className="block text-xs font-semibold text-emerald-900">
                    Unggah Foto Bukti Hasil Perbaikan (Sesudah) *
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="w-24 h-20 rounded-lg bg-neutral-200 overflow-hidden shrink-0 border border-emerald-300">
                      <img
                        src={photoAfterBase64}
                        alt="Hasil Perbaikan"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pilih Foto dari Perangkat</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-emerald-700">
                        Foto ini akan langsung tampil di pelacakan masyarakat.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Catatan Berita Acara Petugas *
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tuliskan tindakan yang telah dilakukan: pembersihan puing, pelapisan tack coat, pemadatan roller..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTaskModal(null)}
                  className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {isUpdating ? 'Menyimpan...' : 'Simpan Pembaruan Progres'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
