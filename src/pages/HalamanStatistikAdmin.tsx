import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PALEMBANG_DISTRICTS } from '../data/initialData';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Printer, 
  Calendar, 
  Layers,
  Filter
} from 'lucide-react';

export const HalamanStatistikAdmin: React.FC = () => {
  const { reports, roads } = useApp();
  const [selectedYear, setSelectedYear] = useState('2026');

  // Calculate statistics per district
  const districtCounts = PALEMBANG_DISTRICTS.map(dist => {
    const count = reports.filter(r => r.district === dist).length;
    return { name: dist, count };
  }).sort((a, b) => b.count - a.count);

  const maxDistrictCount = Math.max(...districtCounts.map(d => d.count), 1);

  // Calculate statistics per category
  const categories = [
    'Lubang Besar (Pothole)',
    'Jalan Amblas / Penurunan',
    'Retak Buaya / Rusak Parah',
    'Aspal Mengelupas / Terkikis',
    'Drainase Rusak / Banjir Genangan',
    'Gelombang Jalan / Rutting',
  ];

  const categoryCounts = categories.map(cat => {
    const count = reports.filter(r => r.category === cat).length;
    return { name: cat, count };
  }).sort((a, b) => b.count - a.count);

  // Status breakdown
  const statusSummary = {
    selesai: reports.filter(r => r.status === 'Selesai').length,
    proses: reports.filter(r => r.status === 'Dalam Perbaikan').length,
    tugas: reports.filter(r => r.status === 'Ditugaskan').length,
    verif: reports.filter(r => r.status === 'Menunggu Verifikasi').length,
    tolak: reports.filter(r => r.status === 'Ditolak').length,
  };

  // Severity breakdown
  const severitySummary = {
    berat: reports.filter(r => r.severity === 'Berat').length,
    sedang: reports.filter(r => r.severity === 'Sedang').length,
    ringan: reports.filter(r => r.severity === 'Ringan').length,
  };

  // Monthly simulated distribution
  const monthlyTrend = [
    { month: 'Jan', count: 18 },
    { month: 'Feb', count: 24 },
    { month: 'Mar', count: reports.length + 12 },
    { month: 'Apr', count: 21 },
    { month: 'Mei', count: 15 },
    { month: 'Jun', count: 12 },
    { month: 'Jul', count: 14 },
    { month: 'Ags', count: 19 },
    { month: 'Sep', count: 27 },
    { month: 'Okt', count: 32 },
    { month: 'Nov', count: 38 },
    { month: 'Des', count: 42 },
  ];

  const maxMonthly = Math.max(...monthlyTrend.map(m => m.count));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            9. Analitik & Laporan
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Statistik dan Grafik Kerusakan Jalan Kota Palembang
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Visualisasi data aduan publik, tren bulanan, serta sebaran titik jalan rusak per kecamatan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="2026">Tahun Anggaran 2026</option>
            <option value="2025">Tahun Anggaran 2025</option>
          </select>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekapitulasi</span>
          </button>
        </div>
      </div>

      {/* Top 3 Analytical Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="text-xs font-medium text-neutral-500">Kecamatan Aduan Tertinggi</div>
          <div className="text-2xl font-bold text-neutral-900">
            {districtCounts[0]?.name || 'Ilir Timur II'}
          </div>
          <p className="text-xs text-neutral-500">
            Mencatatkan frekuensi kerusakan aspal tertinggi akibat tingginya volume angkutan logistik kota.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="text-xs font-medium text-neutral-500">Dominasi Jenis Kerusakan</div>
          <div className="text-2xl font-bold text-amber-700">
            Lubang Aspal (Pothole)
          </div>
          <p className="text-xs text-neutral-500">
            Menyumbang lebih dari 55% aduan masyarakat, dipicu oleh siklus curah hujan tinggi di Palembang.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="text-xs font-medium text-neutral-500">Kondisi Kemantapan Ruas Kota</div>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums">
            87.4% Mantap
          </div>
          <p className="text-xs text-neutral-500">
            Standar kemantapan jalan Dinas PUPR berdasarkan survei berkala International Roughness Index (IRI).
          </p>
        </div>
      </div>

      {/* Grid: Bar Chart per Kecamatan & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Sebaran per Kecamatan (Horizontal Bar Chart) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Sebaran Titik Kerusakan per Kecamatan
              </h2>
              <p className="text-[11px] text-neutral-500">Frekuensi aduan masyarakat se-Kota Palembang</p>
            </div>
            <span className="text-xs font-mono text-neutral-500">18 Kecamatan</span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-2">
            {districtCounts.map(item => {
              const pct = (item.count / maxDistrictCount) * 100;
              return (
                <div key={item.name} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-neutral-700">
                    <span className="font-medium">{item.name}</span>
                    <span className="font-mono tabular-nums font-bold text-neutral-900">
                      {item.count} Laporan
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Tren Aduan Bulanan (Vertical Bar Chart) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-neutral-100">
            <h2 className="text-sm font-bold text-neutral-900">
              Tren Aduan Kerusakan Jalan 2026
            </h2>
            <p className="text-[11px] text-neutral-500">Korelasi lonjakan aduan pada musim hujan akhir tahun</p>
          </div>

          {/* SVG Vertical Chart */}
          <div className="h-56 flex items-end justify-between gap-1.5 pt-6 pb-2 px-2 border-b border-neutral-200">
            {monthlyTrend.map(m => {
              const hPct = (m.count / maxMonthly) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[10px] font-mono text-neutral-500 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.count}
                  </div>
                  <div
                    className="w-full bg-neutral-800 group-hover:bg-amber-500 rounded-t transition-all"
                    style={{ height: `${hPct}%` }}
                  />
                  <div className="text-[10px] text-neutral-500 font-medium">{m.month}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
            <span>Rata-Rata Bulanan:</span>
            <span className="font-mono font-bold text-neutral-900">22.8 Titik Kerusakan / Bulan</span>
          </div>
        </div>
      </div>

      {/* Grid: Category Distribution & Severity Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Jenis Kerusakan */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 pb-2 border-b border-neutral-100">
            Distribusi Jenis Kerusakan Jalan
          </h2>
          <div className="space-y-3 text-xs">
            {categoryCounts.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50">
                <span className="text-neutral-700">{cat.name}</span>
                <span className="font-mono font-bold text-neutral-900 tabular-nums bg-white px-2 py-0.5 rounded border border-neutral-200">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Penyelesaian & Urgensi */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 pb-2 border-b border-neutral-100">
            Proporsi Status & Tingkat Urgensi
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 space-y-2">
              <div className="text-xs font-semibold text-neutral-700">Tingkat Keparahan</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-red-700">Berat (Darurat):</span>
                  <span className="font-mono font-bold tabular-nums">{severitySummary.berat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Sedang:</span>
                  <span className="font-mono font-bold tabular-nums">{severitySummary.sedang}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Ringan:</span>
                  <span className="font-mono font-bold tabular-nums">{severitySummary.ringan}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 space-y-2">
              <div className="text-xs font-semibold text-neutral-700">Status Penanganan</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Selesai:</span>
                  <span className="font-mono font-bold tabular-nums text-emerald-600">{statusSummary.selesai}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dalam Perbaikan:</span>
                  <span className="font-mono font-bold tabular-nums text-blue-600">{statusSummary.proses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ditugaskan:</span>
                  <span className="font-mono font-bold tabular-nums text-purple-600">{statusSummary.tugas}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verifikasi:</span>
                  <span className="font-mono font-bold tabular-nums text-amber-600">{statusSummary.verif}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            Data statistik ini disinkronkan secara real-time dengan basis data laporan masyarakat Kota Palembang.
          </div>
        </div>
      </div>
    </div>
  );
};
