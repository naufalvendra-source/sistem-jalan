import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  exportReportsToExcel, 
  exportRoadsToExcel, 
  exportCompleteDatabaseExcel,
  parseExcelFile 
} from '../utils/excelExport';
import { PHP_CODE_COLLECTION } from '../data/phpCodeTemplates';
import { RoadReport, RoadMasterData } from '../types';
import { 
  FileSpreadsheet, 
  Database, 
  Download, 
  Upload, 
  X, 
  Check, 
  Copy, 
  Layers, 
  Table, 
  HardDrive, 
  AlertCircle,
  CheckCircle2,
  FileCode
} from 'lucide-react';

export const ExcelDatabaseModal: React.FC = () => {
  const { 
    showExcelDbModal, 
    setShowExcelDbModal, 
    reports, 
    roads, 
    users, 
    importReports, 
    importRoads 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'excel' | 'database' | 'import'>('excel');
  const [selectedTable, setSelectedTable] = useState<'laporan' | 'jalan' | 'users'>('laporan');
  const [copiedSql, setCopiedSql] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importedPreview, setImportedPreview] = useState<any[] | null>(null);
  const [importType, setImportType] = useState<'laporan' | 'jalan'>('laporan');

  if (!showExcelDbModal) return null;

  const sqlDatabaseFile = PHP_CODE_COLLECTION.find(f => f.fileName === 'database.sql')?.code || '';

  const handleDownloadAllExcel = () => {
    exportCompleteDatabaseExcel(reports, roads, users);
  };

  const handleDownloadReportsExcel = () => {
    exportReportsToExcel(reports);
  };

  const handleDownloadRoadsExcel = () => {
    exportRoadsToExcel(roads);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlDatabaseFile], { type: 'text/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'db_jalan_palembang.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlDatabaseFile);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const rows = await parseExcelFile(file);
      setImportedPreview(rows);
      setImportStatus(`Berhasil membaca ${rows.length} baris data dari file "${file.name}".`);
    } catch (err) {
      setImportStatus('Gagal membaca file Excel. Pastikan format .xlsx atau .csv valid.');
    }
  };

  const handleConfirmImport = () => {
    if (!importedPreview || importedPreview.length === 0) return;

    if (importType === 'laporan') {
      const formattedReports: RoadReport[] = importedPreview.map((item, idx) => ({
        id: `rep-import-${Date.now()}-${idx}`,
        ticketCode: item['Nomor Tiket'] || item['ticket_code'] || `PLB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: item['Nama Jalan'] || item['judul'] || 'Laporan Impor Excel',
        roadName: item['Nama Jalan'] || item['nama_jalan'] || 'Jl. Jenderal Sudirman',
        district: item['Kecamatan'] || item['kecamatan'] || 'Ilir Timur I',
        subDistrict: item['Kelurahan'] || item['kelurahan'] || '',
        locationLandmark: item['Patokan Lokasi'] || item['patokan_lokasi'] || 'Sesuai data impor',
        latitude: parseFloat(item['Latitude'] || item['latitude']) || -2.9761,
        longitude: parseFloat(item['Longitude'] || item['longitude']) || 104.7573,
        category: item['Kategori Kerusakan'] || item['kategori'] || 'Lubang Besar (Pothole)',
        severity: item['Tingkat Keparahan'] || item['tingkat_keparahan'] || 'Sedang',
        description: item['Keterangan Deskripsi'] || item['deskripsi'] || 'Diimpor dari file Excel.',
        photoBefore: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        status: (item['Status Penanganan'] || item['status'] || 'Menunggu Verifikasi') as any,
        reporterName: item['Nama Pelapor'] || item['pelapor'] || 'Impor Admin',
        reporterPhone: item['No. WhatsApp Pelapor'] || item['no_hp_pelapor'] || '0812-7000-0000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          {
            id: `tl-imp-${Date.now()}-${idx}`,
            status: 'Menunggu Verifikasi',
            timestamp: new Date().toLocaleString('id-ID') + ' WIB',
            actor: 'Sistem (Impor Excel)',
            notes: 'Data berhasil diimpor dari file spreadsheet Excel.',
          },
        ],
      }));
      importReports(formattedReports);
      setImportStatus(`Sukses! ${formattedReports.length} data aduan berhasil dimasukkan ke sistem & database.`);
    } else {
      const formattedRoads: RoadMasterData[] = importedPreview.map((item, idx) => ({
        id: `rd-imp-${Date.now()}-${idx}`,
        roadCode: item['Kode Ruas'] || item['kode_ruas'] || `PLB-KOT-${Math.floor(100 + Math.random() * 900)}`,
        name: item['Nama Jalan'] || item['nama_jalan'] || 'Ruas Impor',
        district: item['Kecamatan'] || item['kecamatan'] || 'Ilir Barat I',
        lengthKm: parseFloat(item['Panjang (km)'] || item['panjang_km']) || 2.5,
        widthMeters: parseFloat(item['Lebar (meter)'] || item['lebar_m']) || 10.0,
        pavementType: (item['Tipe Perkerasan'] || item['tipe_perkerasan'] || 'Aspal Hotmix') as any,
        authority: (item['Status Kewenangan'] || item['kewenangan'] || 'Jalan Kota Palembang') as any,
        condition: (item['Kondisi Kemantapan'] || item['kondisi'] || 'Baik') as any,
        latitude: parseFloat(item['Latitude'] || item['latitude']) || -2.9761,
        longitude: parseFloat(item['Longitude'] || item['longitude']) || 104.7573,
        lastInspectionDate: new Date().toISOString().split('T')[0],
      }));
      importRoads(formattedRoads);
      setImportStatus(`Sukses! ${formattedRoads.length} ruas jalan berhasil ditambahkan ke database master.`);
    }
    setImportedPreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Pusat Excel & Database Relasional
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  .XLSX & MySQL Ready
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Ekspor data ke Microsoft Excel, impor berkas spreadsheet, dan manajemen skema database MySQL
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExcelDbModal(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('excel')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'excel'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>1. Ekspor ke Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'import'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>2. Masukin / Impor dari Excel</span>
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'database'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>3. Struktur Database MySQL</span>
            </button>
          </div>
          <div className="hidden sm:block text-[11px] text-neutral-500 font-mono">
            {reports.length} Aduan • {roads.length} Ruas Jalan • {users.length} Akun
          </div>
        </div>

        {/* Tab 1: Ekspor ke Excel */}
        {activeTab === 'excel' && (
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Ya, Data Bisa Masuk dan Diekspor ke Microsoft Excel!</strong>
                <p className="mt-0.5 text-emerald-800 leading-relaxed">
                  Semua tabel data (Laporan aduan warga, titik koordinat GPS, status perbaikan, dan master ruas jalan Kota Palembang) dapat diunduh langsung dalam format resmi <strong>.XLSX (Microsoft Excel)</strong> dengan kolom rapi dan multi-sheet.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Master Database Excel */}
              <div className="p-5 rounded-2xl bg-neutral-900 text-white flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-mono">
                    Multi-Sheet Workbook
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Seluruh Basis Data (.xlsx)
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Satu berkas Excel lengkap berisi 3 lembar kerja: Data Aduan Jalan, Master Ruas Jalan Kota Palembang, dan Data Pengguna Sistem.
                  </p>
                </div>
                <button
                  onClick={handleDownloadAllExcel}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Database Excel Lengkap</span>
                </button>
              </div>

              {/* Card 2: Laporan Aduan Excel */}
              <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-mono">
                    {reports.length} Baris Data
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">
                    Rekap Laporan Aduan Jalan (.xlsx)
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Termasuk nomor tiket, ruas jalan, kecamatan, patokan lokasi, koordinat GPS, urgensi, tim penugasan, dan status perbaikan.
                  </p>
                </div>
                <button
                  onClick={handleDownloadReportsExcel}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Data Aduan (.xlsx)</span>
                </button>
              </div>

              {/* Card 3: Master Data Jalan Excel */}
              <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-mono">
                    {roads.length} Ruas Jalan
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">
                    Master Ruas Jalan Palembang (.xlsx)
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Data kode ruas, panjang kilometer, lebar meter, jenis perkerasan aspal/beton, dan kewenangan kota/provinsi/nasional.
                  </p>
                </div>
                <button
                  onClick={handleDownloadRoadsExcel}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Data Ruas (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Excel Preview Sample */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs space-y-3 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-800">
                  Pratinjau Lembar Kerja Excel (Tabel Aduan Jalan)
                </span>
                <span className="text-neutral-400 font-mono text-[11px]">
                  Format: .xlsx (Excel 2007-365)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-800 text-white text-[11px]">
                    <tr>
                      <th className="px-3 py-2">Nomor Tiket</th>
                      <th className="px-3 py-2">Nama Jalan</th>
                      <th className="px-3 py-2">Kecamatan</th>
                      <th className="px-3 py-2">Kategori</th>
                      <th className="px-3 py-2">Urgensi</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Pelapor</th>
                      <th className="px-3 py-2">Petugas UPTD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 font-mono text-[11px]">
                    {reports.slice(0, 4).map(r => (
                      <tr key={r.id} className="hover:bg-neutral-50">
                        <td className="px-3 py-2 font-bold text-emerald-800">{r.ticketCode}</td>
                        <td className="px-3 py-2 font-sans">{r.roadName}</td>
                        <td className="px-3 py-2 font-sans">{r.district}</td>
                        <td className="px-3 py-2 font-sans">{r.category}</td>
                        <td className="px-3 py-2">{r.severity}</td>
                        <td className="px-3 py-2 font-sans">{r.status}</td>
                        <td className="px-3 py-2 font-sans">{r.reporterName}</td>
                        <td className="px-3 py-2 font-sans">{r.assignedOfficerName || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Masukin / Impor dari Excel */}
        {activeTab === 'import' && (
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
              <strong className="font-bold flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Cara Memasukkan File Excel ke Dalam Database Sistem</span>
              </strong>
              <p className="leading-relaxed text-blue-800">
                Punya rekapan aduan atau inventarisasi jalan dalam bentuk Excel (.xlsx atau .csv)? Unggah file di bawah ini untuk memasukkan data secara massal ke database aplikasi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Upload Dropzone */}
              <div className="p-6 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-2xl text-center space-y-3 hover:border-emerald-500 transition-colors">
                <FileSpreadsheet className="w-10 h-10 text-neutral-400 mx-auto" />
                <div>
                  <div className="text-xs font-bold text-neutral-800">
                    Pilih File Excel (.xlsx / .xls / .csv)
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Kolom yang didukung: Nama Jalan, Kecamatan, Kategori, Urgensi, dsb.
                  </p>
                </div>

                <div className="flex justify-center gap-4 text-xs font-medium py-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importType"
                      checked={importType === 'laporan'}
                      onChange={() => setImportType('laporan')}
                    />
                    <span>Sebagai Data Aduan Jalan</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importType"
                      checked={importType === 'jalan'}
                      onChange={() => setImportType('jalan')}
                    />
                    <span>Sebagai Master Ruas Jalan</span>
                  </label>
                </div>

                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Cari & Unggah Berkas Excel</span>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Import status & confirmation */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Status Pemrosesan File
                </h4>
                {importStatus ? (
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 leading-relaxed font-mono">
                    {importStatus}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400">
                    Belum ada berkas dipilih. Silakan pilih berkas Excel di sebelah kiri.
                  </p>
                )}

                {importedPreview && (
                  <div className="space-y-3">
                    <div className="text-xs text-neutral-600 font-medium">
                      Siap memasukkan <strong>{importedPreview.length} baris</strong> ke tabel {importType === 'laporan' ? 'laporan_jalan' : 'master_jalan'}.
                    </div>
                    <button
                      onClick={handleConfirmImport}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Konfirmasi & Simpan ke Database Sekarang</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Template Download Help */}
            <div className="p-4 bg-neutral-100 rounded-xl text-xs text-neutral-600 flex items-center justify-between">
              <span>Butuh contoh format template Excel untuk diisi?</span>
              <button
                onClick={handleDownloadReportsExcel}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Format Template Excel (.xlsx)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Struktur Database MySQL */}
        {activeTab === 'database' && (
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Ya, Terdapat Database Relasional Lengkap (db_jalan_palembang)!</strong>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Database dirancang dengan skema relasional MySQL / MariaDB standar industri dengan kunci primer (Primary Key), kunci asing (Foreign Key), indeks, dan data awal kota Palembang.
                </p>
              </div>
            </div>

            {/* Database Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTable('laporan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedTable === 'laporan' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Tabel: laporan_jalan
                </button>
                <button
                  onClick={() => setSelectedTable('jalan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedTable === 'jalan' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Tabel: master_jalan
                </button>
                <button
                  onClick={() => setSelectedTable('users')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedTable === 'users' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Tabel: users
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-300"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
                </button>
                <button
                  onClick={handleDownloadSql}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download db_jalan_palembang.sql</span>
                </button>
              </div>
            </div>

            {/* Table Schema Detail */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between text-xs font-mono font-bold text-neutral-800">
                <span>Skema Kolom Tabel: {selectedTable === 'laporan' ? 'laporan_jalan' : selectedTable === 'jalan' ? 'master_jalan' : 'users'}</span>
                <span className="text-neutral-500 font-normal">Engine: InnoDB | Charset: utf8mb4</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2">Nama Kolom (Field)</th>
                      <th className="px-4 py-2">Tipe Data</th>
                      <th className="px-4 py-2">Keterangan / Relasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-[11px]">
                    {selectedTable === 'laporan' ? (
                      <>
                        <tr><td className="px-4 py-2 font-bold text-amber-700">id</td><td>INT AUTO_INCREMENT</td><td>PRIMARY KEY</td></tr>
                        <tr><td className="px-4 py-2 font-bold text-amber-700">ticket_code</td><td>VARCHAR(25) UNIQUE</td><td>Kode Tiket Aduan (misal PLB-2026-8912)</td></tr>
                        <tr><td className="px-4 py-2">user_id</td><td>INT</td><td>FOREIGN KEY → users(id)</td></tr>
                        <tr><td className="px-4 py-2">nama_jalan</td><td>VARCHAR(150)</td><td>Nama Ruas Jalan di Palembang</td></tr>
                        <tr><td className="px-4 py-2">kecamatan</td><td>VARCHAR(80)</td><td>Kecamatan (Ilir Barat, Sukarami, dll)</td></tr>
                        <tr><td className="px-4 py-2">latitude, longitude</td><td>DECIMAL(10,8), DECIMAL(11,8)</td><td>Koordinat Spasial Geografis GPS</td></tr>
                        <tr><td className="px-4 py-2">tingkat_keparahan</td><td>ENUM('Ringan','Sedang','Berat')</td><td>Urgensi Penanganan Darurat</td></tr>
                        <tr><td className="px-4 py-2">status</td><td>ENUM('Menunggu Verifikasi', ...)</td><td>Status Penanganan Perbaikan</td></tr>
                        <tr><td className="px-4 py-2">foto_sebelum, foto_sesudah</td><td>VARCHAR(255)</td><td>Path berkas foto bukti fisik</td></tr>
                        <tr><td className="px-4 py-2">created_at, updated_at</td><td>TIMESTAMP</td><td>Waktu pelaporan & pembaruan</td></tr>
                      </>
                    ) : selectedTable === 'jalan' ? (
                      <>
                        <tr><td className="px-4 py-2 font-bold text-amber-700">id</td><td>INT AUTO_INCREMENT</td><td>PRIMARY KEY</td></tr>
                        <tr><td className="px-4 py-2 font-bold text-amber-700">kode_ruas</td><td>VARCHAR(30) UNIQUE</td><td>Kode Ruas Jalan (misal PLB-KOT-001)</td></tr>
                        <tr><td className="px-4 py-2">nama_jalan</td><td>VARCHAR(150)</td><td>Nama Resmi Ruas Jalan</td></tr>
                        <tr><td className="px-4 py-2">kecamatan</td><td>VARCHAR(80)</td><td>Wilayah Kecamatan</td></tr>
                        <tr><td className="px-4 py-2">panjang_km, lebar_m</td><td>DECIMAL(6,2), DECIMAL(5,2)</td><td>Dimensi Ruas Jalan</td></tr>
                        <tr><td className="px-4 py-2">tipe_perkerasan</td><td>ENUM('Aspal Hotmix', 'Rigid Beton', ...)</td><td>Spesifikasi Struktur Jalan</td></tr>
                        <tr><td className="px-4 py-2">kewenangan</td><td>ENUM('Jalan Kota', 'Jalan Provinsi', ...)</td><td>Status Kewenangan Pengelolaan</td></tr>
                        <tr><td className="px-4 py-2">kondisi</td><td>ENUM('Baik', 'Sedang', 'Rusak', ...)</td><td>Tingkat Kemantapan Jalan</td></tr>
                      </>
                    ) : (
                      <>
                        <tr><td className="px-4 py-2 font-bold text-amber-700">id</td><td>INT AUTO_INCREMENT</td><td>PRIMARY KEY</td></tr>
                        <tr><td className="px-4 py-2">nama</td><td>VARCHAR(150)</td><td>Nama Lengkap Pengguna</td></tr>
                        <tr><td className="px-4 py-2 font-bold text-amber-700">email</td><td>VARCHAR(100) UNIQUE</td><td>Email Login Pengguna</td></tr>
                        <tr><td className="px-4 py-2">password</td><td>VARCHAR(255)</td><td>Enkripsi Kata Sandi (Hash MD5 / Bcrypt)</td></tr>
                        <tr><td className="px-4 py-2">role</td><td>ENUM('masyarakat','petugas','admin')</td><td>Tingkat Hak Akses Pengguna</td></tr>
                        <tr><td className="px-4 py-2">nik_nip</td><td>VARCHAR(30)</td><td>Nomor Identitas KTP / NIP Pegawai</td></tr>
                        <tr><td className="px-4 py-2">status</td><td>ENUM('Aktif','Nonaktif')</td><td>Status Keaktifan Akun</td></tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SQL Code Preview */}
            <div className="bg-neutral-950 rounded-xl p-4 text-xs font-mono text-neutral-300 max-h-56 overflow-y-auto border border-neutral-800">
              <pre className="whitespace-pre-wrap">{sqlDatabaseFile}</pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-neutral-500" />
            <span>Format Ekspor: Microsoft Excel (.xlsx), CSV, dan MySQL Script (.sql)</span>
          </div>
          <button
            onClick={() => setShowExcelDbModal(false)}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
