# MANUAL BOOK - APLIKASI ABSENSI FACE RECOGNITION

## **1. Pendahuluan**
Aplikasi Absensi Digital ini dirancang untuk mempermudah pencatatan kehadiran menggunakan teknologi pengenalan wajah (Face Recognition). Aplikasi ini mendukung dua peran utama: **Admin** (Pengelola) dan **Student/Siswa** (Pengguna).

---

## **2. Alur Utama Program**

### **A. Tahap Autentikasi (Login)**
Sebelum mengakses fitur aplikasi, pengguna harus melakukan login terlebih dahulu:
1.  **Buka Aplikasi**: Pengguna akan diarahkan ke halaman Login.
2.  **Input Kredensial**: Masukkan **Username** dan **Password** yang telah terdaftar.
3.  **Proses Validasi**: Klik tombol **"Masuk"**. 
    *   Jika berhasil: Muncul popup **"Success - Berhasil masuk ke sistem"**, lalu diarahkan ke Dashboard sesuai Role.
    *   Jika gagal: Muncul popup **"Gagal"** dengan keterangan kesalahan.

---

### **B. Alur Kerja Admin (Super Admin / Admin)**
Setelah login sebagai Admin, alur kerjanya adalah sebagai berikut:

1.  **Dashboard & Statistik**:
    *   Admin melihat ringkasan total pegawai, jumlah kehadiran hari ini, siswa yang terlambat, dan grafik tren mingguan.
2.  **Manajemen Data Karyawan**:
    *   Pilih menu **"Data Karyawan"**.
    *   **Tambah Pegawai**: Klik "Tambah", isi data (NIP, Nama, Jabatan, dll), lalu simpan.
    *   **Registrasi Wajah**: Pada daftar karyawan, klik tombol **"Registrasi Wajah"**. Arahkan wajah ke kamera untuk mengambil sampel descriptor biometrik.
3.  **Monitoring Absensi**:
    *   Pilih menu **"Absensi"** untuk melihat siapa saja yang sudah melakukan scan wajah hari ini secara real-time.
4.  **Laporan Kehadiran**:
    *   Pilih menu **"Laporan"**.
    *   Tentukan filter (Range Tanggal, Departemen, atau Nama).
    *   Klik **"Export Data"** untuk mengunduh laporan dalam format **PDF** atau **Excel**.
5.  **Manajemen Feedback (Aduan)**:
    *   Pilih menu **"Feedback Absensi"**.
    *   Admin melihat daftar aduan dari siswa.
    *   Klik ikon **"Chat"** untuk memberikan tanggapan, mengubah status aduan (Diproses/Selesai), dan memberikan estimasi waktu penyelesaian.
6.  **Pengaturan Sistem**:
    *   Pilih menu **"Pengaturan"**.
    *   Admin dapat mengatur **Jam Kerja** (Waktu Masuk/Pulang), **Lokasi GPS** kantor, dan daftar **Hari Libur**.

---

### **C. Alur Kerja Siswa (User / Student)**
Setelah login sebagai Siswa, alur kerjanya adalah sebagai berikut:

1.  **Dashboard Siswa**:
    *   Siswa melihat status kehadiran terakhir dan ringkasan aduan yang sedang diajukan.
2.  **Melakukan Absensi Wajah**:
    *   Pilih menu **"Absensi"**.
    *   Klik tombol untuk membuka kamera.
    *   Arahkan wajah ke kamera. Sistem AI akan mencocokkan wajah dengan database.
    *   Jika cocok, sistem akan mencatat jam hadir/pulang secara otomatis.
3.  **Mengirim Feedback (Aduan)**:
    *   Pilih menu **"Feedback Absensi"**.
    *   Klik **"Buat Laporan"**.
    *   Isi **Kategori**, **Judul**, dan **Deskripsi Masalah** (misal: "Gagal absen karena kamera gelap").
    *   Pantau status aduan di tabel riwayat (apakah sedang diproses atau sudah selesai oleh admin).
4.  **Update Profil**:
    *   Pilih menu **"Pengaturan"** (atau klik ikon profil).
    *   Siswa dapat memperbarui data diri seperti email, nomor telepon, dan bio.

---

### **D. Proses Logout**
Untuk menjaga keamanan akun:
1.  Klik tombol **"Logout"** di menu navigasi samping atau di menu profil pojok kanan atas.
2.  Sistem akan menghapus sesi (token) dari browser.
3.  Pengguna akan diarahkan kembali ke halaman Login.

---

## **3. Dokumentasi Menu & Tampilan**

### **Halaman Login**
- **Tampilan:** Formulir login elegan dengan ilustrasi modern.
- **Fungsi:** Gerbang utama keamanan. Mendukung fitur "Remember Me" dan lihat password.

### **Dashboard**
- **Admin:** Fokus pada statistik organisasi (Total data, presentase kehadiran).
- **Siswa:** Fokus pada data personal (Jam absen hari ini, status aduan terakhir).

### **Manajemen Karyawan**
- Daftar tabel dengan fitur pencarian dan filter per departemen.
- Integrasi langsung dengan modul pendaftaran wajah AI.

### **Feedback System**
- Sistem komunikasi dua arah antara siswa dan admin.
- Mendukung status: *Pending, In Progress, Resolved, Rejected*.

---

## **4. Deskripsi Teknis Aplikasi**
Aplikasi ini dibangun menggunakan arsitektur modern:
- **Backend**: Node.js & Express dengan database MySQL.
- **Frontend**: React.js & Material UI (MUI).
- **AI Engine**: Face-api.js untuk pengenalan wajah biometrik di sisi klien.
- **Security**: JSON Web Token (JWT) untuk manajemen sesi dan enkripsi password Bcrypt.

---

## **5. Debugging & Troubleshooting**

### **Kasus 1: Gagal Login**
- **Masalah:** Username/Password salah atau akun tidak aktif.
- **Solusi:** Pastikan kredensial benar. Admin dapat mereset password melalui database jika diperlukan.

### **Kasus 2: Wajah Tidak Dikenali**
- **Masalah:** Pencahayaan kurang atau wajah terlalu jauh dari kamera.
- **Solusi:** Pastikan wajah berada di area terang dan lakukan registrasi ulang wajah jika fitur wajah berubah secara signifikan.

### **Kasus 3: Lokasi Tidak Akurat**
- **Masalah:** Gagal absen karena dianggap di luar area kantor.
- **Solusi:** Pastikan GPS perangkat aktif dan browser memiliki izin akses lokasi.
