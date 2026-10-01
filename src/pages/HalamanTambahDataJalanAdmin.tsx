import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PALEMBANG_DISTRICTS } from '../data/initialData';
import { RoadMasterData, RoadAuthority, RoadCondition } from '../types';
import { exportRoadsToExcel } from '../utils/excelExport';
import { 
  Layers, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Download, 
  MapPin, 
  Compass,
  FileSpreadsheet,
  Upload
} from 'lucide-react';

export const HalamanTambahDataJalanAdmin: React.FC = () => {
  const { roads, addRoad, deleteRoad, setShowExcelDbModal } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [roadCode, setRoadCode] = useState(`PLB-KOT-0${roads.length + 1}`);
  const [name, setName] = useState('');
  const [district, setDistrict] = useState(PALEMBANG_DISTRICTS[0]);
  const [lengthKm, setLengthKm] = useState('3.5');
  const [widthMeters, setWidthMeters] = useState('12.0');
  const [pavementType, setPavementType] = useState<'Aspal Hotmix' | 'Rigid Beton' | 'Lapen' | 'Paving'>('Aspal Hotmix');
  const [authority, setAuthority] = useState<RoadAuthority>('Jalan Kota Palembang');
  const [condition, setCondition] = useState<RoadCondition>('Baik');
  const [latitude, setLatitude] = useState('-2.9850');
  const [longitude, setLongitude] = useState('104.7520');

  const filteredRoads = roads.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.roadCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addRoad({
      roadCode: roadCode || `PLB-KOT-${Date.now()}`,
      name,
      district,
      lengthKm: parseFloat(lengthKm) || 1.0,
      widthMeters: parseFloat(widthMeters) || 8.0,
      pavementType,
      authority,
      condition,
      latitude: parseFloat(latitude) || -2.9761,
      longitude: parseFloat(longitude) || 104.7573,
      lastInspectionDate: new Date().toISOString().split('T')[0],
    });

    setSuccessMessage(`Ruas jalan "${name}" berhasil ditambahkan ke basis data master.`);
    setName('');
    setShowAddForm(false);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            11. Inventarisasi Infrastruktur
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Master Data & Tambah Ruas Jalan Kota Palembang
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Katalog basis data inventarisasi teknis jalan, panjang ruas, spesifikasi perkerasan, dan status kewenangan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExcelDbModal(true)}
            className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Buka Pusat Excel & Database"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Masukin dari Excel</span>
          </button>

          <button
            onClick={() => exportRoadsToExcel(filteredRoads)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Ekspor ke Excel (.xlsx)</span>
          </button>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Tutup Formulir' : 'Tambah Ruas Jalan Baru'}</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Road Form Modal/Section */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-md space-y-5 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Formulir Perekaman Ruas Jalan Baru</span>
            </h2>
            <span className="text-xs text-neutral-400">Bidang Bina Marga Dinas PUPR</span>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Kode Ruas *</label>
              <input
                type="text"
                value={roadCode}
                onChange={(e) => setRoadCode(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Nama Jalan Resmi *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Jl. Mayor Zen"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Wilayah Kecamatan *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
              >
                {PALEMBANG_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Panjang Ruas (km) *</label>
              <input
                type="number"
                step="0.1"
                value={lengthKm}
                onChange={(e) => setLengthKm(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Lebar Badan Jalan (meter) *</label>
              <input
                type="number"
                step="0.5"
                value={widthMeters}
                onChange={(e) => setWidthMeters(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Tipe Perkerasan Jalan *</label>
              <select
                value={pavementType}
                onChange={(e) => setPavementType(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
              >
                <option value="Aspal Hotmix">Aspal Hotmix (AC-WC / AC-BC)</option>
                <option value="Rigid Beton">Rigid Beton Semen</option>
                <option value="Lapen">Lapen (Lapisan Penetrasi)</option>
                <option value="Paving">Paving Block</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Status Kewenangan Jalan *</label>
              <select
                value={authority}
                onChange={(e) => setAuthority(e.target.value as RoadAuthority)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
              >
                <option value="Jalan Kota Palembang">Jalan Kota Palembang</option>
                <option value="Jalan Provinsi Sumsel">Jalan Provinsi Sumsel</option>
                <option value="Jalan Nasional">Jalan Nasional</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Kondisi Kemantapan Eksisting</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as RoadCondition)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
              >
                <option value="Baik">Baik (Mantap)</option>
                <option value="Sedang">Sedang (Mantap)</option>
                <option value="Rusak Ringan">Rusak Ringan (Tidak Mantap)</option>
                <option value="Rusak Berat">Rusak Berat (Tidak Mantap)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Titik Lat</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Titik Lng</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="md:col-span-3 pt-3 border-t border-neutral-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800"
              >
                Simpan Ruas Jalan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Road Inventory Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs space-y-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari kode ruas, nama jalan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="text-xs text-neutral-500 font-mono">
            Total Ruas: <strong className="text-neutral-900 tabular-nums">{filteredRoads.length}</strong> Ruas
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Kode Ruas</th>
                <th className="px-4 py-3">Nama Jalan</th>
                <th className="px-4 py-3">Kecamatan</th>
                <th className="px-4 py-3">Dimensi</th>
                <th className="px-4 py-3">Perkerasan</th>
                <th className="px-4 py-3">Kewenangan</th>
                <th className="px-4 py-3">Kondisi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredRoads.map(road => (
                <tr key={road.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-amber-700">
                    {road.roadCode}
                  </td>
                  <td className="px-4 py-3 font-semibold text-neutral-900">
                    {road.name}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {road.district}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-neutral-600">
                    {road.lengthKm} km • {road.widthMeters} m
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {road.pavementType}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      road.authority === 'Jalan Kota Palembang'
                        ? 'bg-blue-50 text-blue-800'
                        : road.authority === 'Jalan Provinsi Sumsel'
                        ? 'bg-purple-50 text-purple-800'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {road.authority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      road.condition === 'Baik' 
                        ? 'text-emerald-700' 
                        : road.condition === 'Sedang' 
                        ? 'text-blue-700' 
                        : road.condition === 'Rusak Ringan' 
                        ? 'text-amber-700' 
                        : 'text-red-700'
                    }`}>
                      {road.condition}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteRoad(road.id)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                      title="Hapus Ruas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
