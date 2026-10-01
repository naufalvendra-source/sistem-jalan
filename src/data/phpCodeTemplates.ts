export interface PhpFileTemplate {
  fileName: string;
  category: 'Database' | 'Config' | 'Auth' | 'Masyarakat' | 'Petugas' | 'Admin';
  description: string;
  code: string;
}

export const PHP_CODE_COLLECTION: PhpFileTemplate[] = [
  {
    fileName: 'database.sql',
    category: 'Database',
    description: 'Skema database MySQL lengkap untuk sistem SIPELAJAR Palembang',
    code: `-- Database: db_jalan_palembang
-- Dibuat untuk Sistem Informasi Pelaporan Jalan Rusak Kota Palembang (PUPR)

CREATE DATABASE IF NOT EXISTS db_jalan_palembang;
USE db_jalan_palembang;

-- 1. Tabel Pengguna (Multi-role)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    role ENUM('masyarakat', 'petugas', 'admin') NOT NULL DEFAULT 'masyarakat',
    nik_nip VARCHAR(30) NULL,
    wilayah_tugas VARCHAR(100) NULL,
    instansi VARCHAR(150) NULL,
    status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Master Data Ruas Jalan Palembang
CREATE TABLE IF NOT EXISTS master_jalan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_ruas VARCHAR(30) UNIQUE NOT NULL,
    nama_jalan VARCHAR(150) NOT NULL,
    kecamatan VARCHAR(80) NOT NULL,
    panjang_km DECIMAL(6,2) NOT NULL,
    lebar_m DECIMAL(5,2) NOT NULL,
    tipe_perkerasan ENUM('Aspal Hotmix', 'Rigid Beton', 'Lapen', 'Paving') DEFAULT 'Aspal Hotmix',
    kewenangan ENUM('Jalan Kota Palembang', 'Jalan Provinsi Sumsel', 'Jalan Nasional') DEFAULT 'Jalan Kota Palembang',
    kondisi ENUM('Baik', 'Sedang', 'Rusak Ringan', 'Rusak Berat') DEFAULT 'Baik',
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    tgl_inspeksi DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Laporan Kerusakan Jalan
CREATE TABLE IF NOT EXISTS laporan_jalan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_code VARCHAR(25) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    judul VARCHAR(200) NOT NULL,
    nama_jalan VARCHAR(150) NOT NULL,
    kecamatan VARCHAR(80) NOT NULL,
    kelurahan VARCHAR(80) NULL,
    patokan_lokasi TEXT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    kategori VARCHAR(80) NOT NULL,
    tingkat_keparahan ENUM('Ringan', 'Sedang', 'Berat') NOT NULL,
    deskripsi TEXT NOT NULL,
    foto_sebelum VARCHAR(255) NOT NULL,
    foto_progres VARCHAR(255) NULL,
    foto_sesudah VARCHAR(255) NULL,
    status ENUM('Menunggu Verifikasi', 'Diverifikasi', 'Ditugaskan', 'Dalam Perbaikan', 'Selesai', 'Ditolak') DEFAULT 'Menunggu Verifikasi',
    petugas_id INT NULL,
    nama_tim_kerja VARCHAR(100) NULL,
    alasan_penolakan TEXT NULL,
    volume_material VARCHAR(150) NULL,
    estimasi_selesai DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (petugas_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Tabel Riwayat Status / Timeline Audit
CREATE TABLE IF NOT EXISTS riwayat_laporan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    laporan_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    aktor VARCHAR(150) NOT NULL,
    catatan TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (laporan_id) REFERENCES laporan_jalan(id) ON DELETE CASCADE
);

-- Seed Pengguna Awal
INSERT INTO users (nama, email, password, no_hp, role, nik_nip, wilayah_tugas, instansi) VALUES
('Bambang Tri Atmojo', 'warga@palembang.go.id', MD5('password123'), '081273891120', 'masyarakat', '1671011504890002', 'Ilir Barat I', 'Warga Palembang'),
('Hendra Saputra, S.T.', 'petugas@pupr.palembang.go.id', MD5('petugas123'), '085268004321', 'petugas', '198806142011011003', 'Sukarami & AAL', 'UPTD Jalan & Jembatan'),
('Ahmad Fauzi, S.T., M.Eng', 'admin@pupr.palembang.go.id', MD5('admin123'), '081377448899', 'admin', '197903212005021002', 'Kota Palembang', 'Bina Marga Dinas PUPR');`
  },
  {
    fileName: 'config/koneksi.php',
    category: 'Config',
    description: 'Konfigurasi koneksi MySQLi PHP dan konstanta sistem',
    code: `<?php
// config/koneksi.php
// Konfigurasi Database SIPELAJAR Palembang

$host     = "localhost";
$username = "root";
$password = "";
$database = "db_jalan_palembang";

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    die("Koneksi Database Gagal: " . mysqli_connect_error());
}

// Set timezone Indonesia Barat (WIB)
date_default_timezone_set('Asia/Jakarta');

// Start session bila belum aktif
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Base URL helper
define('BASE_URL', 'http://localhost/sipelajar-palembang/');
define('APP_NAME', 'SIPELAJAR Kota Palembang');
?>`
  },
  {
    fileName: 'login.php',
    category: 'Auth',
    description: 'Halaman 1: Otentikasi Multi-role (Masyarakat, Petugas, Admin)',
    code: `<?php
// login.php - Halaman 1: Login Multi-Role
require_once 'config/koneksi.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = mysqli_real_escape_string($conn, $_POST['email']);
    $password = md5($_POST['password']);

    $query = "SELECT * FROM users WHERE email='$email' AND password='$password' AND status='Aktif' LIMIT 1";
    $result = mysqli_query($conn, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $user = mysqli_fetch_assoc($result);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['nama']    = $user['nama'];
        $_SESSION['role']    = $user['role'];
        $_SESSION['email']   = $user['email'];

        // Redirect sesuai role pengguna
        if ($user['role'] === 'admin') {
            header('Location: admin_dashboard.php');
        } elseif ($user['role'] === 'petugas') {
            header('Location: petugas_dashboard.php');
        } else {
            header('Location: dashboard_masyarakat.php');
        }
        exit;
    } else {
        $error = 'Email atau kata sandi tidak valid / Akun nonaktif.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Login - SIPELAJAR Kota Palembang</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center min-vh-100">
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow-sm border-0 rounded-4">
          <div class="card-body p-4 p-md-5">
            <h4 class="fw-bold text-center text-primary mb-1">SIPELAJAR</h4>
            <p class="text-muted text-center small mb-4">Sistem Informasi Pelaporan Jalan Rusak Kota Palembang</p>
            
            <?php if ($error): ?>
              <div class="alert alert-danger py-2 small"><?= $error ?></div>
            <?php endif; ?>

            <form method="POST">
              <div class="mb-3">
                <label class="form-label small fw-semibold">Email Pengguna</label>
                <input type="email" name="email" class="form-control" placeholder="nama@email.com" required>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-semibold">Kata Sandi</label>
                <input type="password" name="password" class="form-control" placeholder="••••••••" required>
              </div>
              <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold">Masuk ke Portal</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    fileName: 'dashboard_masyarakat.php',
    category: 'Masyarakat',
    description: 'Halaman 2: Dashboard Warga / Masyarakat',
    code: `<?php
// dashboard_masyarakat.php - Halaman 2: Dashboard Warga
require_once 'config/koneksi.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'masyarakat') {
    header('Location: login.php');
    exit;
}

$user_id = $_SESSION['user_id'];
$total_query = mysqli_query($conn, "SELECT COUNT(*) as total FROM laporan_jalan WHERE user_id=$user_id");
$total_laporan = mysqli_fetch_assoc($total_query)['total'];

$selesai_query = mysqli_query($conn, "SELECT COUNT(*) as total FROM laporan_jalan WHERE user_id=$user_id AND status='Selesai'");
$total_selesai = mysqli_fetch_assoc($selesai_query)['total'];

$proses_query = mysqli_query($conn, "SELECT COUNT(*) as total FROM laporan_jalan WHERE user_id=$user_id AND status IN ('Menunggu Verifikasi','Diverifikasi','Ditugaskan','Dalam Perbaikan')");
$total_proses = mysqli_fetch_assoc($proses_query)['total'];

$laporan_saya = mysqli_query($conn, "SELECT * FROM laporan_jalan WHERE user_id=$user_id ORDER BY id DESC LIMIT 5");
?>
<!-- Tampilan Ringkasan & Riwayat Aduan Masyarakat Palembang -->`
  },
  {
    fileName: 'lapor.php',
    category: 'Masyarakat',
    description: 'Halaman 3: Formulir Pelaporan Jalan Rusak dengan Unggah Foto & Koordinat GPS',
    code: `<?php
// lapor.php - Halaman 3: Formulir Pengaduan Jalan Rusak Palembang
require_once 'config/koneksi.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$pesan = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $judul        = mysqli_real_escape_string($conn, $_POST['judul']);
    $nama_jalan   = mysqli_real_escape_string($conn, $_POST['nama_jalan']);
    $kecamatan    = mysqli_real_escape_string($conn, $_POST['kecamatan']);
    $patokan      = mysqli_real_escape_string($conn, $_POST['patokan_lokasi']);
    $latitude     = floatval($_POST['latitude']);
    $longitude    = floatval($_POST['longitude']);
    $kategori     = mysqli_real_escape_string($conn, $_POST['kategori']);
    $keparahan    = mysqli_real_escape_string($conn, $_POST['keparahan']);
    $deskripsi    = mysqli_real_escape_string($conn, $_POST['deskripsi']);
    $ticket_code  = 'PLB-' . date('Y') . '-' . rand(1000, 9999);
    $user_id      = $_SESSION['user_id'];

    // Handle Upload Foto
    $foto_name = '';
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === 0) {
        $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
        $foto_name = 'uploads/' . time() . '_' . rand(100, 999) . '.' . $ext;
        move_uploaded_file($_FILES['foto']['tmp_name'], $foto_name);
    }

    $insert = "INSERT INTO laporan_jalan (ticket_code, user_id, judul, nama_jalan, kecamatan, patokan_lokasi, latitude, longitude, kategori, tingkat_keparahan, deskripsi, foto_sebelum, status)
               VALUES ('$ticket_code', $user_id, '$judul', '$nama_jalan', '$kecamatan', '$patokan', $latitude, $longitude, '$kategori', '$keparahan', '$deskripsi', '$foto_name', 'Menunggu Verifikasi')";
    
    if (mysqli_query($conn, $insert)) {
        $laporan_id = mysqli_insert_id($conn);
        mysqli_query($conn, "INSERT INTO riwayat_laporan (laporan_id, status, aktor, catatan) VALUES ($laporan_id, 'Menunggu Verifikasi', '{$_SESSION['nama']}', 'Laporan berhasil dibuat.')");
        header("Location: status_laporan.php?ticket=$ticket_code");
        exit;
    }
}
?>`
  },
  {
    fileName: 'status_laporan.php',
    category: 'Masyarakat',
    description: 'Halaman 4: Pelacakan Status Pengaduan Berdasarkan Nomor Tiket & Timeline',
    code: `<?php
// status_laporan.php - Halaman 4: Lacak Progres Pengaduan
require_once 'config/koneksi.php';

$ticket = isset($_GET['ticket']) ? mysqli_real_escape_string($conn, $_GET['ticket']) : '';
$laporan = null;
$riwayat = [];

if ($ticket) {
    $q = mysqli_query($conn, "SELECT l.*, u.nama as pelapor, u.no_hp as hp_pelapor FROM laporan_jalan l JOIN users u ON l.user_id = u.id WHERE l.ticket_code='$ticket'");
    if (mysqli_num_rows($q) > 0) {
        $laporan = mysqli_fetch_assoc($q);
        $hist = mysqli_query($conn, "SELECT * FROM riwayat_laporan WHERE laporan_id={$laporan['id']} ORDER BY created_at ASC");
        while ($r = mysqli_fetch_assoc($hist)) {
            $riwayat[] = $r;
        }
    }
}
?>`
  },
  {
    fileName: 'petugas_dashboard.php',
    category: 'Petugas',
    description: 'Halaman 5: Dashboard Petugas Lapangan PUPR Palembang',
    code: `<?php
// petugas_dashboard.php - Halaman 5: Dashboard Petugas
require_once 'config/koneksi.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'petugas') {
    header('Location: login.php');
    exit;
}

$petugas_id = $_SESSION['user_id'];
$tugas_baru = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as c FROM laporan_jalan WHERE petugas_id=$petugas_id AND status='Ditugaskan'"))['c'];
$sedang_dikerjakan = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as c FROM laporan_jalan WHERE petugas_id=$petugas_id AND status='Dalam Perbaikan'"))['c'];
$tuntas = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as c FROM laporan_jalan WHERE petugas_id=$petugas_id AND status='Selesai'"))['c'];
?>`
  },
  {
    fileName: 'petugas_laporan.php',
    category: 'Petugas',
    description: 'Halaman 6: Daftar Laporan Tugas Petugas & Pembaruan Status/Foto Perbaikan',
    code: `<?php
// petugas_laporan.php - Halaman 6: Daftar Tugas Petugas & Update Status
require_once 'config/koneksi.php';

// Handler update status pengerjaan (Mulai / Selesai dengan foto sesudah)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_status'])) {
    $laporan_id = intval($_POST['laporan_id']);
    $new_status = mysqli_real_escape_string($conn, $_POST['status']);
    $catatan    = mysqli_real_escape_string($conn, $_POST['catatan']);
    $material   = mysqli_real_escape_string($conn, $_POST['volume_material']);

    $foto_update = '';
    if (isset($_FILES['foto_hasil']) && $_FILES['foto_hasil']['error'] === 0) {
        $ext = pathinfo($_FILES['foto_hasil']['name'], PATHINFO_EXTENSION);
        $foto_update = 'uploads/selesai_' . time() . '.' . $ext;
        move_uploaded_file($_FILES['foto_hasil']['tmp_name'], $foto_update);
        mysqli_query($conn, "UPDATE laporan_jalan SET foto_sesudah='$foto_update' WHERE id=$laporan_id");
    }

    mysqli_query($conn, "UPDATE laporan_jalan SET status='$new_status', volume_material='$material' WHERE id=$laporan_id");
    mysqli_query($conn, "INSERT INTO riwayat_laporan (laporan_id, status, aktor, catatan) VALUES ($laporan_id, '$new_status', '{$_SESSION['nama']}', '$catatan')");
}
?>`
  },
  {
    fileName: 'sebaran_jalan.php',
    category: 'Masyarakat',
    description: 'Halaman 7: Peta & Daftar Sebaran Jalan Rusak Kota Palembang',
    code: `<?php
// sebaran_jalan.php - Halaman 7: Sebaran Titik Jalan Rusak
require_once 'config/koneksi.php';

$daftar_titik = mysqli_query($conn, "SELECT id, ticket_code, nama_jalan, kecamatan, tingkat_keparahan, status, latitude, longitude, foto_sebelum FROM laporan_jalan WHERE status != 'Ditolak' ORDER BY id DESC");
?>`
  },
  {
    fileName: 'admin_dashboard.php',
    category: 'Admin',
    description: 'Halaman 8: Dashboard Administrator Sistem Dinas PUPR Palembang',
    code: `<?php
// admin_dashboard.php - Halaman 8: Dashboard Master Admin
require_once 'config/koneksi.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Location: login.php');
    exit;
}

$stat = mysqli_fetch_assoc(mysqli_query($conn, "
    SELECT 
        COUNT(*) as total_masuk,
        SUM(CASE WHEN status='Menunggu Verifikasi' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status='Dalam Perbaikan' THEN 1 ELSE 0 END) as on_progress,
        SUM(CASE WHEN status='Selesai' THEN 1 ELSE 0 END) as selesai
    FROM laporan_jalan
"));
?>`
  },
  {
    fileName: 'admin_statistik.php',
    category: 'Admin',
    description: 'Halaman 9: Halaman Statistik, Rasio dan Grafik Admin',
    code: `<?php
// admin_statistik.php - Halaman 9: Grafik & Statistik Kerusakan Jalan Palembang
require_once 'config/koneksi.php';

$per_kecamatan = mysqli_query($conn, "SELECT kecamatan, COUNT(*) as jumlah FROM laporan_jalan GROUP BY kecamatan ORDER BY jumlah DESC");
$per_kategori  = mysqli_query($conn, "SELECT kategori, COUNT(*) as jumlah FROM laporan_jalan GROUP BY kategori");
?>`
  },
  {
    fileName: 'admin_peta.php',
    category: 'Admin',
    description: 'Halaman 10: Halaman Peta GIS Interaktif Seluruh Laporan Admin',
    code: `<?php
// admin_peta.php - Halaman 10: Peta GIS Laporan Jalan Kota Palembang
require_once 'config/koneksi.php';

$all_markers = mysqli_query($conn, "SELECT * FROM laporan_jalan");
?>`
  },
  {
    fileName: 'admin_tambah_jalan.php',
    category: 'Admin',
    description: 'Halaman 11: Master Data Ruas Jalan Kota Palembang (CRUD Jalan)',
    code: `<?php
// admin_tambah_jalan.php - Halaman 11: Master Data Ruas Jalan
require_once 'config/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['tambah_jalan'])) {
    $kode      = mysqli_real_escape_string($conn, $_POST['kode_ruas']);
    $nama      = mysqli_real_escape_string($conn, $_POST['nama_jalan']);
    $kecamatan = mysqli_real_escape_string($conn, $_POST['kecamatan']);
    $panjang   = floatval($_POST['panjang_km']);
    $lebar     = floatval($_POST['lebar_m']);
    $tipe      = mysqli_real_escape_string($conn, $_POST['tipe_perkerasan']);
    $wewenang  = mysqli_real_escape_string($conn, $_POST['kewenangan']);
    $kondisi   = mysqli_real_escape_string($conn, $_POST['kondisi']);
    $lat       = floatval($_POST['latitude']);
    $lng       = floatval($_POST['longitude']);

    $q = "INSERT INTO master_jalan (kode_ruas, nama_jalan, kecamatan, panjang_km, lebar_m, tipe_perkerasan, kewenangan, kondisi, latitude, longitude, tgl_inspeksi)
          VALUES ('$kode', '$nama', '$kecamatan', $panjang, $lebar, '$tipe', '$wewenang', '$kondisi', $lat, $lng, CURDATE())";
    mysqli_query($conn, $q);
}
?>`
  },
  {
    fileName: 'admin_kelola_laporan.php',
    category: 'Admin',
    description: 'Halaman 12: Kelola, Verifikasi & Disposisi Laporan Jalan Rusak',
    code: `<?php
// admin_kelola_laporan.php - Halaman 12: Verifikasi & Disposisi Admin
require_once 'config/koneksi.php';

// Disposisi ke petugas
if (isset($_POST['disposisi'])) {
    $id_laporan = intval($_POST['laporan_id']);
    $petugas_id = intval($_POST['petugas_id']);
    $tim_kerja  = mysqli_real_escape_string($conn, $_POST['tim_kerja']);

    mysqli_query($conn, "UPDATE laporan_jalan SET status='Ditugaskan', petugas_id=$petugas_id, nama_tim_kerja='$tim_kerja' WHERE id=$id_laporan");
    mysqli_query($conn, "INSERT INTO riwayat_laporan (laporan_id, status, aktor, catatan) VALUES ($id_laporan, 'Ditugaskan', 'Admin PUPR', 'Ditugaskan ke tim teknis.')");
}
?>`
  },
  {
    fileName: 'admin_users.php',
    category: 'Admin',
    description: 'Halaman 13: Pengelolaan Data Pengguna & Hak Akses Admin',
    code: `<?php
// admin_users.php - Halaman 13: Manajemen Pengguna Sistem
require_once 'config/koneksi.php';

// CRUD Pengguna (Masyarakat, Petugas Lapangan, Admin)
$users = mysqli_query($conn, "SELECT * FROM users ORDER BY role ASC, nama ASC");
?>`
  },
];
