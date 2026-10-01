import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PalembangMap } from '../components/PalembangMap';
import { 
  PALEMBANG_DISTRICTS, 
  PALEMBANG_MAJOR_ROADS, 
  ASSET_POTHOLE 
} from '../data/initialData';
import { DamageCategory, DamageSeverity } from '../types';
import { 
  Upload, 
  Camera, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  FileText,
  User,
  Phone,
  Crosshair,
  Info
} from 'lucide-react';

export const FormulirLaporJalan: React.FC = () => {
  const { currentUser, createReport, setActivePage } = useApp();

  const [title, setTitle] = useState('');
  const [roadName, setRoadName] = useState(PALEMBANG_MAJOR_ROADS[0]);
  const [customRoad, setCustomRoad] = useState('');
  const [district, setDistrict] = useState(PALEMBANG_DISTRICTS[0]);
  const [subDistrict, setSubDistrict] = useState('');
  const [locationLandmark, setLocationLandmark] = useState('');
  const [coords, setCoords] = useState<[number, number]>([-2.9761, 104.7573]);
  const [category, setCategory] = useState<DamageCategory>('Lubang Besar (Pothole)');
  const [severity, setSeverity] = useState<DamageSeverity>('Berat');
  const [description, setDescription] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string>(ASSET_POTHOLE);

  const [reporterName, setReporterName] = useState(currentUser?.name || 'Warga Palembang');
  const [reporterPhone, setReporterPhone] = useState(currentUser?.phone || '0812-7389-1120');
  const [reporterNik, setReporterNik] = useState(currentUser?.nikOrNip || '1671011504890002');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  // Handle local file upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoBase64(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseCurrentGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          // Fallback to iconic Palembang point
          setCoords([-2.9465, 104.7642]);
        }
      );
    } else {
      setCoords([-2.9465, 104.7642]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const actualRoadName = roadName === 'Lainnya' ? (customRoad || 'Jalan Umum Palembang') : roadName;

    const newRep = createReport({
      title: title || `Laporan Kerusakan di ${actualRoadName}`,
      roadName: actualRoadName,
      district,
      subDistrict,
      locationLandmark: locationLandmark || 'Sekitar lokasi koordinat GPS',
      latitude: coords[0],
      longitude: coords[1],
      category,
      severity,
      description: description || 'Ditemukan kerusakan aspal jalan yang mengganggu kelancaran lalu lintas.',
      photoBefore: photoBase64,
      reporterName,
      reporterPhone,
      reporterNik,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessTicket(newRep.ticketCode);
    }, 600);
  };

  if (successTicket) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Laporan Berhasil Terkirim
          </span>
          <h2 className="text-2xl font-bold text-neutral-900">
            Terima Kasih Atas Partisipasi Anda!
          </h2>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            Laporan Anda telah teregistrasi dan langsung masuk ke sistem monitoring Dinas PUPR Kota Palembang.
          </p>
        </div>

        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 max-w-sm mx-auto space-y-1">
          <div className="text-xs text-neutral-500 font-medium">Nomor Tiket Aduan Anda:</div>
          <div className="text-2xl font-mono font-bold text-amber-700 tracking-wider">
            {successTicket}
          </div>
          <div className="text-[11px] text-neutral-400">
            Simpan nomor ini untuk mengecek progres penanganan.
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setActivePage('status_laporan')}
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Lacak Status Laporan Sekarang
          </button>
          <button
            onClick={() => {
              setSuccessTicket(null);
              setTitle('');
              setDescription('');
            }}
            className="px-5 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg text-xs font-semibold"
          >
            Buat Laporan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
          3. Formulir Aduan Warga
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
          Formulir Lapor Kerusakan Jalan Umum Palembang
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Lengkapi data kerusakan jalan, sertakan foto jelas dan koordinat GPS agar tim teknis segera diterjunkan ke lokasi.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Lokasi Jalan & Peta GPS */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <MapPin className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-bold text-neutral-900">
              1. Lokasi & Titik Koordinat GPS Jalan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Ruas Jalan Kota Palembang *
              </label>
              <select
                value={roadName}
                onChange={(e) => setRoadName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              >
                {PALEMBANG_MAJOR_ROADS.map(road => (
                  <option key={road} value={road}>{road}</option>
                ))}
                <option value="Lainnya">-- Ruas Jalan Lainnya --</option>
              </select>
            </div>

            {roadName === 'Lainnya' && (
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nama Jalan Lainnya *
                </label>
                <input
                  type="text"
                  value={customRoad}
                  onChange={(e) => setCustomRoad(e.target.value)}
                  placeholder="Contoh: Jl. Talang Kelapa Blok B"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Kecamatan di Palembang *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              >
                {PALEMBANG_DISTRICTS.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Kelurahan (Opsional)
              </label>
              <input
                type="text"
                value={subDistrict}
                onChange={(e) => setSubDistrict(e.target.value)}
                placeholder="Contoh: 20 Ilir, Lorok Pakjo, Bukit Sangkal"
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Patokan / Titik Acuan Lokasi *
              </label>
              <input
                type="text"
                value={locationLandmark}
                onChange={(e) => setLocationLandmark(e.target.value)}
                placeholder="Contoh: Depan Indomaret, 50m sebelum Lampu Merah Simpang Charitas, sebelah kiri jalan"
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Interactive Map Picker */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-medium text-neutral-700">
                Pilih Titik di Peta (Klik / Geser Pin):
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUseCurrentGps}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md transition-colors"
                >
                  <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ambil Titik Koordinat</span>
                </button>
                <span className="font-mono text-xs bg-neutral-100 px-2 py-1 rounded text-neutral-600">
                  Lat: {coords[0].toFixed(5)}, Lng: {coords[1].toFixed(5)}
                </span>
              </div>
            </div>

            <PalembangMap
              pickerMode={true}
              selectedCoord={coords}
              onLocationSelect={(lat, lng) => setCoords([lat, lng])}
              height="300px"
              center={coords}
              zoom={14}
            />
          </div>
        </div>

        {/* Section 2: Detail Kerusakan & Foto */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-bold text-neutral-900">
              2. Kategori Kerusakan & Bukti Foto
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Judul Singkat Laporan *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Lubang Aspal Dalam Membahayakan Motor"
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Jenis / Kategori Kerusakan *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DamageCategory)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Lubang Besar (Pothole)">Lubang Besar (Pothole)</option>
                <option value="Jalan Amblas / Penurunan">Jalan Amblas / Penurunan</option>
                <option value="Retak Buaya / Rusak Parah">Retak Buaya / Rusak Parah</option>
                <option value="Aspal Mengelupas / Terkikis">Aspal Mengelupas / Terkikis</option>
                <option value="Drainase Rusak / Banjir Genangan">Drainase Rusak / Banjir Genangan</option>
                <option value="Gelombang Jalan / Rutting">Gelombang Jalan / Rutting</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-2">
                Tingkat Keparahan / Urgensi *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Ringan', 'Sedang', 'Berat'] as DamageSeverity[]).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      severity === sev
                        ? sev === 'Berat'
                          ? 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500'
                          : sev === 'Sedang'
                          ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-500'
                          : 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{sev}</span>
                    {sev === 'Berat' && <span className="text-[10px] text-red-600">(Darurat)</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload Box */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-medium text-neutral-700">
                Unggah Foto Kondisi Jalan Rusak *
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-5 text-center hover:border-amber-500 transition-colors bg-neutral-50/50">
                  <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <div className="text-xs font-medium text-neutral-700 mb-1">
                    Pilih file foto dari perangkat Anda
                  </div>
                  <p className="text-[11px] text-neutral-400 mb-3">
                    Format JPG, PNG atau WEBP (Maksimal 10MB)
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Berkas Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Photo Preview */}
                <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-100 relative h-48 flex items-center justify-center">
                  {photoBase64 ? (
                    <>
                      <img
                        src={photoBase64}
                        alt="Preview Kerusakan"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2 bg-neutral-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                        Foto Bukti Terlampir
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-neutral-400">Belum ada foto dipilih</div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Deskripsi Rincian Kerusakan & Dampak Lalu Lintas *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan ukuran lubang, apakah sering terjadi genangan air, atau hampir memicu kecelakaan pemotor..."
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Data Pelapor */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <User className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-bold text-neutral-900">
              3. Identitas Pelapor (Kerahasiaan Dijamin)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Nama Lengkap Pelapor *
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Nomor WhatsApp / HP Aktif *
              </label>
              <input
                type="tel"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                NIK KTP (Opsional)
              </label>
              <input
                type="text"
                value={reporterNik}
                onChange={(e) => setReporterNik(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Data pelapor hanya digunakan oleh Dinas PUPR Palembang untuk konfirmasi dan pemberitahuan penyelesaian perbaikan via WhatsApp / SMS.
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActivePage('dashboard_masyarakat')}
            className="px-5 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-400 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Mengirim Laporan...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kirim Laporan Kerusakan Jalan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
