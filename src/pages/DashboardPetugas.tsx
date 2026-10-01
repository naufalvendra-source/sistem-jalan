import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  HardHat, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Wrench, 
  Truck,
  Activity
} from 'lucide-react';

export const DashboardPetugas: React.FC = () => {
  const { currentUser, reports, setActivePage, setSelectedTicket } = useApp();

  // Tasks assigned to officer or general team
  const myAssignedTasks = reports.filter(r => 
    r.status === 'Ditugaskan' || (r.assignedOfficerId === currentUser?.id)
  );

  const activeWork = reports.filter(r => 
    r.status === 'Dalam Perbaikan'
  );

  const completedTasks = reports.filter(r => 
    r.status === 'Selesai' && (r.assignedOfficerId === currentUser?.id || true)
  );

  const urgentTasks = reports.filter(r => 
    r.severity === 'Berat' && ['Ditugaskan', 'Dalam Perbaikan'].includes(r.status)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Officer Header Card */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-neutral-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
            <HardHat className="w-4 h-4" />
            <span>5. Dashboard Petugas Lapangan PUPR Palembang</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Halo, {currentUser?.name || 'Hendra Saputra, S.T.'}
          </h1>
          <p className="text-xs text-neutral-300 max-w-xl">
            {currentUser?.agency || 'Regu Reaksi Cepat UPTD Jalan PUPR Kota Palembang'} • Wilayah Tugas: <strong className="text-white">{currentUser?.assignedDistrict || 'Sukarami, Alang-Alang Lebar & Ilir Timur'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActivePage('petugas_daftar_laporan')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-xs"
          >
            <Wrench className="w-4 h-4" />
            <span>Kelola Daftar Tugas Lapangan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Anti-slop tabular metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 mb-1">Tugas Masuk / Ditugaskan</div>
          <div className="text-3xl font-bold text-amber-600 tabular-nums">{myAssignedTasks.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Siap disurvei & dieksekusi</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 mb-1">Sedang Dalam Pengerjaan</div>
          <div className="text-3xl font-bold text-blue-600 tabular-nums">{activeWork.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Alat berat & aspal aktif</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 mb-1">Prioritas Darurat (Berat)</div>
          <div className="text-3xl font-bold text-red-600 tabular-nums">{urgentTasks.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Target waktu respons &lt; 24 jam</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 mb-1">Pekerjaan Selesai</div>
          <div className="text-3xl font-bold text-emerald-600 tabular-nums">{completedTasks.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Uji kerataan tuntas</div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Tasks & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Urgent / Active Work Orders */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-600" />
              <span>Surat Perintah Kerja (SPK) Perlu Tindakan Segera</span>
            </h2>
            <button
              onClick={() => setActivePage('petugas_daftar_laporan')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <span>Lihat Semua Tugas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {reports.filter(r => ['Ditugaskan', 'Dalam Perbaikan'].includes(r.status)).map(task => (
              <div 
                key={task.id}
                className="bg-white p-5 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all shadow-xs flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="flex gap-4">
                  {task.photoBefore && (
                    <img 
                      src={task.photoBefore} 
                      alt={task.title}
                      className="w-20 h-20 rounded-lg object-cover border border-neutral-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="text-xs text-neutral-500 flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-700">{task.ticketCode}</span>
                      <span>•</span>
                      <span>Kec. {task.district}</span>
                      <span>•</span>
                      <span className="font-semibold text-neutral-700">{task.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      {task.roadName} — {task.title}
                    </h3>
                    <p className="text-xs text-neutral-600">
                      {task.locationLandmark}
                    </p>
                    <div className="text-[11px] text-neutral-500 pt-1">
                      Urgensi: <strong className={task.severity === 'Berat' ? 'text-red-600' : 'text-amber-600'}>{task.severity}</strong> • Tim: {task.workTeam || 'Regu UPTD Pemeliharaan'}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between items-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    task.status === 'Dalam Perbaikan' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {task.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTicket(task.ticketCode);
                      setActivePage('petugas_daftar_laporan');
                    }}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Buka & Update Progres
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Field Equipment & Protocol */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Standar Operasional (SOP) Lapangan</span>
            </h3>
            <ul className="text-xs text-neutral-600 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">1.</span>
                <span>Pasang rambu keselamatan lalu lintas (traffic cone) minimal 50 meter sebelum titik penanganan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">2.</span>
                <span>Lakukan pemotongan aspal dengan rapi (persegi panjang) menggunakan asphalt cutter sebelum pemadatan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">3.</span>
                <span>Semprotkan tack coat / prime coat secukupnya sebagai perekat hotmix dengan pondasi dasar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">4.</span>
                <span>Wajib unggah foto hasil akhir setelah jalan dipadatkan dengan baby roller dan siap dilalui.</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <Calendar className="w-4 h-4" />
              <span>Jadwal Pengiriman Hotmix Palembang</span>
            </div>
            <p className="leading-relaxed">
              Batching plant aspal hotmix siap beroperasi mulai pukul 07.30 WIB dan 19.30 WIB (untuk pengerjaan malam di jalur protokol Jl. Sudirman & Basuki Rahmat).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
