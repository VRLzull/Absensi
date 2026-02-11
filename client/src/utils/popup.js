import Swal from 'sweetalert2'

export const showLoading = (title = 'Memproses...', text = 'Harap tunggu') => {
  return Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    showConfirmButton: false,
    customClass: {
      popup: 'rounded-2xl'
    },
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

export const closePopup = () => {
  try {
    Swal.close()
  } catch {}
}

export const showSuccess = (title = 'Berhasil', text = '') => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    showConfirmButton: true,
    confirmButtonText: 'OK',
    confirmButtonColor: '#7c3aed', // Matching the purple-ish button in the image
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'px-8 py-2 rounded-lg'
    }
  })
}

export const showError = (title = 'Gagal', text = 'Terjadi kesalahan') => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    showConfirmButton: true,
    confirmButtonText: 'OK',
    confirmButtonColor: '#ef4444', // Red for error
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'px-8 py-2 rounded-lg'
    }
  })
}

export const confirmAction = (title = 'Yakin?', text = 'Tindakan ini tidak bisa dibatalkan') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#078085',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, lanjutkan',
    cancelButtonText: 'Batal',
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'px-6 py-2 rounded-lg',
      cancelButton: 'px-6 py-2 rounded-lg'
    }
  })
}
