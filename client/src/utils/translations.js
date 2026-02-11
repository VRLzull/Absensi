// Translation strings
const translations = {
  id: {
    // Common
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.delete': 'Hapus',
    'common.edit': 'Edit',
    'common.search': 'Cari',
    'common.filter': 'Filter',
    'common.loading': 'Memuat...',
    'common.success': 'Berhasil',
    'common.error': 'Error',
    'common.confirm': 'Konfirmasi',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.employees': 'Karyawan',
    'nav.attendance': 'Absensi',
    'nav.reports': 'Laporan',
    'nav.settings': 'Pengaturan',
    'nav.profile': 'Profil',
    'nav.logout': 'Keluar',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalEmployees': 'Total Karyawan',
    'dashboard.presentToday': 'Hadir Hari Ini',
    'dashboard.absentToday': 'Tidak Hadir',
    'dashboard.lateToday': 'Terlambat',
    
    // Employees
    'employees.title': 'Data Karyawan',
    'employees.add': 'Tambah Karyawan',
    'employees.edit': 'Edit Karyawan',
    'employees.delete': 'Hapus Karyawan',
    'employees.name': 'Nama',
    'employees.department': 'Departemen',
    'employees.position': 'Jabatan',
    
    // Attendance
    'attendance.title': 'Data Absensi',
    'attendance.checkIn': 'Check In',
    'attendance.checkOut': 'Check Out',
    'attendance.totalEmployees': 'Total Karyawan',
    'attendance.present': 'Hadir',
    'attendance.late': 'Terlambat',
    'attendance.absent': 'Tidak Hadir',
    
    // Profile
    'profile.title': 'Profil Saya',
    'profile.edit': 'Edit Profil',
    'profile.save': 'Simpan Perubahan',
    'profile.changePassword': 'Ubah Password',
    'profile.uploadPhoto': 'Update Foto Profil',
    'profile.viewAttendance': 'Lihat Riwayat Absensi',
    'profile.preferences': 'Preferensi',
    'profile.notifications': 'Notifikasi',
    'profile.security': 'Keamanan & Tampilan',
    'profile.language': 'Bahasa',
    'profile.theme': 'Tema',
    
    // Settings
    'settings.title': 'Pengaturan Sistem',
    'settings.save': 'Simpan Pengaturan',
    'settings.reset': 'Reset Default',
    
    // Login
    'login.title': 'Absensi App',
    'login.subtitle': 'Sistem Manajemen Absensi',
    'login.username': 'Nama Pengguna',
    'login.password': 'Kata Sandi',
    'login.submit': 'Masuk',

    // Feedback - Laporan
    'nav.feedback': 'Feedback Absensi',
    'feedback.title': 'Feedback Absensi Siswa',
    'feedback.add': 'Buat Laporan',
    'feedback.list': 'Riwayat Laporan',
    'feedback.category': 'Kategori',
    'feedback.status': 'Status',
    'feedback.subject': 'Judul',
    'feedback.description': 'Detail Laporan',
    'feedback.response': 'Tanggapan',
    'feedback.status.pending': 'Menunggu',
    'feedback.status.in_progress': 'Diproses',
    'feedback.status.resolved': 'Selesai',
    'feedback.status.rejected': 'Ditolak',
    'feedback.timeline': 'Timeline & Estimasi',
    'feedback.submitted': 'Dikirim',
    'feedback.processed': 'Diproses',
    'feedback.estimated': 'Estimasi Waktu',
    'feedback.completed': 'Selesai',
    'feedback.estimated_placeholder': 'Berapa jam/hari yang dibutuhkan?',
    'feedback.estimated_helper': 'Admin: Masukkan estimasi waktu untuk menyelesaikan aduan ini',
  },
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.confirm': 'Confirm',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.employees': 'Employees',
    'nav.attendance': 'Attendance',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalEmployees': 'Total Employees',
    'dashboard.presentToday': 'Present Today',
    'dashboard.absentToday': 'Absent',
    'dashboard.lateToday': 'Late',
    
    // Employees
    'employees.title': 'Employee Data',
    'employees.add': 'Add Employee',
    'employees.edit': 'Edit Employee',
    'employees.delete': 'Delete Employee',
    'employees.name': 'Name',
    'employees.department': 'Department',
    'employees.position': 'Position',
    
    // Attendance
    'attendance.title': 'Attendance Data',
    'attendance.checkIn': 'Check In',
    'attendance.checkOut': 'Check Out',
    'attendance.totalEmployees': 'Total Employees',
    'attendance.present': 'Present',
    'attendance.late': 'Late',
    'attendance.absent': 'Absent',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save Changes',
    'profile.changePassword': 'Change Password',
    'profile.uploadPhoto': 'Update Profile Photo',
    'profile.viewAttendance': 'View Attendance History',
    'profile.preferences': 'Preferences',
    'profile.notifications': 'Notifications',
    'profile.security': 'Security & Display',
    'profile.language': 'Language',
    'profile.theme': 'Theme',
    
    // Settings
    'settings.title': 'System Settings',
    'settings.save': 'Save Settings',
    'settings.reset': 'Reset Default',
    
    // Login
    'login.title': 'Login to your account',
    'login.subtitle': 'Enter your credentials to access the system',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Login',

    // Feedback - Aspiration
    'nav.feedback': 'Aspirations & Reports',
    'feedback.title': 'Student Aspirations & Reports',
    'feedback.add': 'Create Aspiration',
    'feedback.list': 'History',
    'feedback.category': 'Category',
    'feedback.status': 'Status',
    'feedback.subject': 'Subject',
    'feedback.description': 'Description',
    'feedback.response': 'Response',
    'feedback.status.pending': 'Pending',
    'feedback.status.in_progress': 'In Progress',
    'feedback.status.resolved': 'Resolved',
    'feedback.status.rejected': 'Rejected',
    'feedback.timeline': 'Timeline & Estimation',
    'feedback.submitted': 'Submitted',
    'feedback.processed': 'In Progress',
    'feedback.estimated': 'Estimated Time',
    'feedback.completed': 'Completed',
    'feedback.estimated_placeholder': 'How many hours/days needed?',
    'feedback.estimated_helper': 'Admin: Enter the estimated time to resolve this issue',
  }
};

// Translation hook/function
export const useTranslation = (language = 'id') => {
  const t = (key, defaultValue = key) => {
    return translations[language]?.[key] || translations['id']?.[key] || defaultValue;
  };
  
  return { t, language };
};

// Direct translation function
export const translate = (key, language = 'id', defaultValue = key) => {
  return translations[language]?.[key] || translations['id']?.[key] || defaultValue;
};

export default translations;

