import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PalembangMap } from '../components/PalembangMap';
import { PALEMBANG_DISTRICTS } from '../data/initialData';
import { DamageSeverity, ReportStatus, RoadReport } from '../types';
import { 
  MapPin, 
  Filter, 
  Layers, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  ExternalLink,
  List,
  Eye
} from 'lucide-react';

export const HalamanSebaranJalanRusak: React.FC = () => {
  const { reports, setSelectedTicket, setActivePage } = useApp();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('Semua');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReportDetail, setActiveReportDetail] = useState<RoadReport | null>(null);

  // Filter reports
  const filteredReports = reports.filter(r => {
    if (selectedDistrict !== 'Semua' && r.district !== selectedDistrict) return false;
    if (selectedSeverity !== 'Semua' && r.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'Semua' && r.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = r.roadName.toLowerCase().includes(q) || 
                    r.ticketCode.toLowerCase().includes(q) ||
                    r.district.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenDetail = (rep: RoadReport) => {
    setActiveReportDetail(rep);
  };

  const handleTrackReport = (ticketCode: string) => {
    setSelectedTicket(ticketCode);
    setActivePage('status_laporan');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            7. Peta Sebaran Publik
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Daftar & Peta Sebaran Jalan Rusak Kota Palembang
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Peta geospasial titik kerusakan jalan, lubang, dan amblas yang terdaftar pada Dinas PUPR Kota Palembang.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-white p-2.5 rounded-xl border border-neutral-200">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span className="text-neutral-700">Rusak Berat (Darurat)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-neutral-700">Rusak Sedang</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-neutral-700">Rusak Ringan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
            <span className="text-neutral-700">Selesai Diperbaiki</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari nama jalan / nomor tiket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
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
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Keparahan</option>
            <option value="Berat">Berat</option>
            <option value="Sedang">Sedang</option>
            <option value="Ringan">Ringan</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Ditugaskan">Ditugaskan</option>
            <option value="Dalam Perbaikan">Dalam Perbaikan</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div className="text-xs text-neutral-500 font-mono ml-auto">
          Ditemukan <strong className="text-neutral-900 tabular-nums">{filteredReports.length}</strong> titik
        </div>
      </div>

      {/* Interactive Geolocation Map */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200 shadow-xs">
        <PalembangMap
          reports={filteredReports}
          height="450px"
          onReportClick={handleOpenDetail}
          filterDistrict={selectedDistrict}
          filterSeverity={selectedSeverity}
        />
      </div>

      {/* Detailed Table & Grid of Damage Points */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <List className="w-4 h-4 text-amber-600" />
            <span>Daftar Rincian Titik Kerusakan di Palembang</span>
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">No. Tiket</th>
                  <th className="px-4 py-3">Ruas Jalan</th>
                  <th className="px-4 py-3">Kecamatan</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Keparahan</th>
                  <th className="px-4 py-3">Koordinat GPS</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredReports.map(rep => (
                  <tr key={rep.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-amber-700">
                      {rep.ticketCode}
                    </td>
                    <td className="px-4 py-3 font-semibold text-neutral-900">
                      <div>{rep.roadName}</div>
                      <div className="text-[11px] text-neutral-500 font-normal line-clamp-1">{rep.locationLandmark}</div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {rep.district}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {rep.category}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        rep.severity === 'Berat' 
                          ? 'bg-red-50 text-red-700' 
                          : rep.severity === 'Sedang' 
                          ? 'bg-amber-50 text-amber-700' 
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {rep.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-500 text-[11px] tabular-nums">
                      {rep.latitude.toFixed(4)}, {rep.longitude.toFixed(4)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        rep.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rep.status === 'Dalam Perbaikan'
                          ? 'bg-blue-100 text-blue-800'
                          : rep.status === 'Ditugaskan'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rep.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleTrackReport(rep.ticketCode)}
                        className="inline-flex items-center gap-1 text-xs text-neutral-700 hover:text-amber-700 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lacak</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
