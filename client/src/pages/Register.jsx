import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link,
  Snackbar,
} from '@mui/material';
import {
  PersonAddOutlined,
  Visibility,
  VisibilityOff,
  Business,
  Person,
  Email,
  Lock,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useThemeContext } from '../contexts/ThemeContext';
import { useTranslation } from '../utils/translations';
import { motion } from 'framer-motion';
import { showLoading, showSuccess, showError, closePopup } from '../utils/popup';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    employee_id: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const { language } = useThemeContext();
  const { t } = useTranslation(language);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      showLoading('Mendaftar...', 'Membuat akun baru');
      const result = await register(formData);
      await closePopup();
      if (result.success) {
        await showSuccess('Registrasi berhasil');
        navigate('/login');
      } else {
        await showError('Registrasi gagal', result.error);
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      await showError('Registrasi gagal', err.message);
    } finally {
      await closePopup();
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #078085ff 0%, #115e59 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', 
        padding: 2,
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        elevation={0}
        sx={{
          padding: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: 500,
        }}
      >
        {/* Logo dan Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
            textAlign: 'center',
          }}
        >
          <Avatar
            component={motion.div}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2 
            }}
            sx={{
              m: 1,
              bgcolor: '#078085ff',
              width: 64,
              height: 64,
              mb: 2,
              boxShadow: '0 4px 6px -1px rgba(7, 128, 133, 0.4)',
            }}
          >
            <PersonAddOutlined sx={{ fontSize: 32, color: '#ffffff' }} />
          </Avatar>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              mb: 1,
            }}
          >
            Daftar Akun
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            Silakan lengkapi data diri Anda
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert
            severity="error"
            sx={{
              width: '100%',
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            variant="filled"
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="full_name"
            label="Nama Lengkap"
            name="full_name"
            autoComplete="name"
            autoFocus
            value={formData.full_name}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="employee_id"
            label="ID Pegawai (Opsional)"
            name="employee_id"
            placeholder="Contoh: EMP001"
            value={formData.employee_id}
            onChange={handleChange}
            helperText="Masukkan ID Pegawai untuk melihat riwayat absensi Anda"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 4,
              mb: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              bgcolor: '#078085ff',
              '&:hover': {
                bgcolor: '#066d71',
              },
              boxShadow: '0 4px 6px -1px rgba(7, 128, 133, 0.3)',
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Daftar Sekarang'
            )}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Sudah punya akun?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#078085ff',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Masuk di sini
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
