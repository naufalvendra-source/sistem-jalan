import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Printer, 
  Share2, 
  AlertCircle, 
  Calendar, 
  HardHat, 
  ShieldCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { ReportStatus } from '../types';

export const HalamanStatusLaporan: React.FC = () => {
  const { reports, selectedTicket, setSelectedTicket, setActivePage } = useApp();
  const [searchInput, setSearchInput] = useState(selectedTicket || '');

  // Find report by ticket code
  const currentReport = reports.find(
    r => r.ticketCode.toUpperCase() === (selectedTicket || searchInput).trim().toUpperCase()
  ) || reports[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSelectedTicket(searchInput.trim().toUpperCase());
  };

  const statusSteps: { label: ReportStatus; desc: string }[] = [
    { label: 'Menunggu Verifikasi', desc: 'Laporan masuk sistem dan menunggu validasi data teknis.' },
    { label: 'Diverifikasi', desc: 'Validasi wewenang jalan Kota Palembang dan tingkat keparahan.' },
    { label: 'Ditugaskan', desc: 'Surat tugas diterbitkan untuk regu UPTD Dinas PUPR.' },
    { label: 'Dalam Perbaikan', desc: 'Pengerjaan fisik (cutting, patching, overlay hotmix) di lapangan.' },
    { label: 'Selesai', desc: 'Perbaikan tuntas, telah diuji dan jalan kembali aman.' },
  ];

  const getStepState = (stepLabel: ReportStatus) => {
    if (!currentReport) return 'upcoming';
    if (currentReport.status === 'Ditolak') {
      return stepLabel === 'Menunggu Verifikasi' ? 'completed' : 'rejected';
    }

    const order: ReportStatus[] = [
      'Menunggu Verifikasi',
      'Diverifikasi',
      'Ditugaskan',
      'Dalam Perbaikan',
      'Selesai',
    ];

    const currentIndex = order.indexOf(currentReport.status);
    const stepIndex = order.indexOf(stepLabel);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      
      {/* Top Search & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            4. Pemantauan Transparansi
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Status Pelacakan Laporan Jalan
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Pantau tahapan verifikasi, penugasan teknis dan progres penambalan jalan secara transparan.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Masukkan Kode Tiket..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono w-48 sm:w-56"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Cari
          </button>
        </form>
      </div>

      {!currentReport ? (
        <div className="bg-white p-12 rounded-2xl border border-neutral-200 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-neutral-800">Tiket Tidak Ditemukan</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Nomor tiket "{searchInput}" tidak ditemukan dalam database. Periksa kembali format nomor tiket Anda.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Main Ticket Summary Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
            <div className="bg-neutral-900 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                  <span className="font-bold tracking-wider">{currentReport.ticketCode}</span>
                  <span className="text-neutral-500">•</span>
                  <span>Kecamatan {currentReport.district}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {currentReport.roadName}
                </h2>
                <p className="text-xs text-neutral-300 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{currentReport.locationLandmark}</span>
                </p>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end justify-between gap-2 shrink-0">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  currentReport.status === 'Selesai'
                    ? 'bg-emerald-500 text-white'
                    : currentReport.status === 'Dalam Perbaikan'
                    ? 'bg-blue-500 text-white'
                    : currentReport.status === 'Ditugaskan'
                    ? 'bg-purple-500 text-white'
                    : currentReport.status === 'Ditolak'
                    ? 'bg-red-500 text-white'
                    : 'bg-amber-500 text-neutral-950'
                }`}>
                  {currentReport.status}
                </span>

                <button
                  onClick={handlePrint}
                  className="print:hidden inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors border border-neutral-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Tanda Terima</span>
                </button>
              </div>
            </div>

            {/* Sub-meta details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-neutral-50/60 border-b border-neutral-200 text-xs">
              <div>
                <div className="text-neutral-500 mb-0.5">Kategori Kerusakan</div>
                <div className="font-semibold text-neutral-800">{currentReport.category}</div>
              </div>
              <div>
                <div className="text-neutral-500 mb-0.5">Tingkat Keparahan</div>
                <div className="font-semibold text-neutral-800 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    currentReport.severity === 'Berat' ? 'bg-red-500' : currentReport.severity === 'Sedang' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}></span>
                  <span>{currentReport.severity}</span>
                </div>
              </div>
              <div>
                <div className="text-neutral-500 mb-0.5">Tanggal Lapor</div>
                <div className="font-semibold text-neutral-800">
                  {new Date(currentReport.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 mb-0.5">Pelapor</div>
                <div className="font-semibold text-neutral-800">{currentReport.reporterName}</div>
              </div>
            </div>

            {/* Rejection notice if rejected */}
            {currentReport.status === 'Ditolak' && currentReport.rejectionReason && (
              <div className="m-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span>Laporan Ditolak / Dialihkan</span>
                </div>
                <p className="leading-relaxed">{currentReport.rejectionReason}</p>
              </div>
            )}

            {/* Stepper Timeline */}
            <div className="p-6 sm:p-8 space-y-6">
              <h3 className="text-sm font-bold text-neutral-900">
                Tahapan Progres Penanganan Lapangan
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                {statusSteps.map((step, idx) => {
                  const state = getStepState(step.label);
                  return (
                    <div key={step.label} className="relative group">
                      {/* Step Indicator Dot */}
                      <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        state === 'completed'
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                          : state === 'active'
                          ? 'bg-amber-500 text-neutral-950 ring-4 ring-amber-100 animate-pulse'
                          : state === 'rejected'
                          ? 'bg-neutral-300 text-neutral-500'
                          : 'bg-white border-2 border-neutral-300 text-neutral-400'
                      }`}>
                        {state === 'completed' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${
                            state === 'active' ? 'text-amber-800' : state === 'completed' ? 'text-neutral-900' : 'text-neutral-400'
                          }`}>
                            {step.label}
                          </span>
                          {state === 'active' && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                              Sedang Berjalan
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Log / History Entries */}
            {currentReport.timeline && currentReport.timeline.length > 0 && (
              <div className="p-6 bg-neutral-50 border-t border-neutral-200 space-y-3">
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Catatan Berita Acara & Catatan Petugas
                </h4>
                <div className="space-y-2">
                  {currentReport.timeline.map((event) => (
                    <div key={event.id} className="bg-white p-3 rounded-lg border border-neutral-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                        <span className="font-semibold text-neutral-700">{event.actor}</span>
                        <span className="font-mono">{event.timestamp}</span>
                      </div>
                      <p className="text-neutral-600">{event.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Photo Comparison: Sebelum vs Sesudah */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">
              Dokumentasi Foto Lapangan (Sebelum & Sesudah)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-700">Kondisi Awal (Pelaporan)</span>
                  <span className="text-neutral-400">Bukti Foto Warga</span>
                </div>
                <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                  {currentReport.photoBefore ? (
                    <img
                      src={currentReport.photoBefore}
                      alt="Kondisi Awal"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                      Tidak ada foto
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-700">Kondisi Hasil Perbaikan (PUPR)</span>
                  <span className="text-neutral-400">Verifikasi Fisik</span>
                </div>
                <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                  {currentReport.photoAfter ? (
                    <img
                      src={currentReport.photoAfter}
                      alt="Hasil Perbaikan"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-xs text-neutral-400 space-y-1">
                      <Clock className="w-6 h-6 text-neutral-300" />
                      <span>Belum ada foto penyelesaian</span>
                      <span className="text-[10px] text-neutral-400">
                        Foto akan diunggah oleh petugas lapangan setelah pengerjaan aspal tuntas.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {currentReport.repairMaterialVolume && (
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-700 flex items-center justify-between">
                <span className="text-neutral-500">Volume Material Penanganan:</span>
                <span className="font-mono font-bold text-neutral-900">
                  {currentReport.repairMaterialVolume}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
