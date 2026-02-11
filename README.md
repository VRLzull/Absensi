# Absensi-App: Face Recognition Attendance System

Absensi-App adalah platform manajemen kehadiran modern yang memanfaatkan teknologi **AI Face Recognition** untuk memastikan pencatatan kehadiran yang akurat, cepat, dan aman. Dirancang untuk instansi pendidikan maupun perkantoran dengan antarmuka yang responsif dan fitur manajemen yang lengkap.

---

## 🌟 Fitur Utama

### 🤖 Biometric AI Recognition
- **Face-api.js Integration**: Pengenalan wajah secara real-time langsung melalui browser.
- **High Accuracy**: Ekstraksi descriptor wajah unik untuk verifikasi identitas yang presisi.
- **Anti-Spoofing Ready**: Validasi titik lokasi (GPS) untuk memastikan kehadiran di tempat yang sah.

### 👥 Multi-Role System
- **Admin Panel**: Dashboard statistik, manajemen data pegawai/siswa, registrasi wajah, dan pengaturan sistem.
- **Student/User Portal**: Melakukan absensi mandiri, melihat riwayat kehadiran, dan mengirimkan feedback/aduan.

### 📊 Reporting & Analytics
- **Real-time Monitoring**: Pantau kehadiran harian secara instan melalui dashboard interaktif.
- **Export Data**: Unduh laporan kehadiran dalam format **PDF** dan **Excel** untuk kebutuhan administrasi.

### 💬 Feedback System
- Komunikasi dua arah antara pengguna dan admin untuk menangani kendala teknis atau pengaduan secara terorganisir.

---

## 🛠️ Tech Stack

### Frontend
- **React.js**: Library utama untuk antarmuka pengguna yang dinamis.
- **Material UI (MUI)**: Framework desain untuk UI yang bersih dan modern.
- **Vite**: Build tool super cepat untuk pengembangan frontend.

### Backend
- **Node.js & Express**: Server-side runtime dan framework API yang stabil.
- **MySQL**: Database relasional untuk penyimpanan data terstruktur.
- **JWT (JSON Web Token)**: Sistem autentikasi berbasis token yang aman.

### AI Engine
- **Face-api.js**: Implementasi TensorFlow.js untuk deteksi dan pengenalan wajah di sisi klien.

---

## 🛡️ Keamanan & Privasi
- **Data Encryption**: Password dienkripsi menggunakan algoritma **Bcrypt**.
- **Secure Authentication**: Akses API dilindungi oleh middleware JWT.
- **Privacy First**: Data descriptor wajah disimpan dalam bentuk vektor numerik, bukan gambar mentah, untuk menjaga privasi biometrik pengguna.

---

## 📖 Dokumentasi
Untuk panduan instalasi, konfigurasi database, dan panduan penggunaan lengkap bagi Admin maupun Siswa, silakan merujuk pada:
- **[MANUAL_BOOK.md](./MANUAL_BOOK.md)**

---

## 📝 Lisensi
Proyek ini dikembangkan untuk kebutuhan internal. Seluruh hak cipta dilindungi.

---
**Dibuat dengan ❤️ untuk Masa Depan Absensi Digital**
