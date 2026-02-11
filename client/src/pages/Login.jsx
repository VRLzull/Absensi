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
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  Business,
  Person,
  AccessTime,
  Face,
  TrendingUp, 
  CheckCircle,
  Facebook,
  SupportAgent,
  CreditCard,
  Security,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useThemeContext } from '../contexts/ThemeContext';
import { useTranslation } from '../utils/translations';
import { motion } from 'framer-motion';
import { showLoading, showSuccess, showError, closePopup } from '../utils/popup';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const { language, colors, mode } = useThemeContext();
  const { t } = useTranslation(language);

  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      showLoading('Masuk...', 'Memverifikasi akun');
      const result = await login(credentials);
      await closePopup();
      if (result.success) {
        await showSuccess('Success', 'Berhasil masuk ke sistem');
        navigate('/dashboard');
      } else {
        await showError('Gagal', result.error || 'Username atau password salah');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      await showError('Login gagal', err.message);
    } finally {
      await closePopup();
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0b3b2f 0%, #0f4c3f 60%, #0a3a2f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 1.2 }, backgroundPosition: { duration: 20, repeat: Infinity, ease: 'linear' } }}
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'block',
          background:
            'radial-gradient(800px 400px at 10% 20%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%),' +
            'radial-gradient(600px 300px at 85% 15%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 65%),' +
            'radial-gradient(700px 350px at 25% 85%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 60%)'
        }}
      />
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: [0.98, 1, 0.99, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'none',
          pointerEvents: 'none',
          display: 'block'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'none',
          pointerEvents: 'none',
          display: 'block'
        }}
      />
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          position: 'absolute',
          top: -80,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'none',
          filter: 'none',
          display: 'none'
        }}
      />
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        sx={{
          position: 'absolute',
          bottom: -90,
          right: -90,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'none',
          filter: 'none',
          display: 'none'
        }}
      />
      <Box
        sx={{
          width: '100%',
          maxWidth: 1100,
          mx: 'auto',
          display: { xs: 'block', md: 'grid' },
          gridTemplateColumns: { md: '1fr 1fr' },
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 25px 60px -20px rgba(15,76,117,0.35)',
          position: 'relative',
          zIndex: 1,
          background: '#ffffff',
          p: { xs: 1, md: 2 }
        }}
      >
      <Box
        sx={{
          gridColumn: '1 / -1',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: { xs: 2, md: 3 },
          py: 2
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
          Absensi Digital
        </Typography>
      </Box>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\' fill=\'rgba(255,255,255,0.08)\'/%3E%3Ccircle cx=\'40\' cy=\'30\' r=\'1\' fill=\'rgba(255,255,255,0.06)\'/%3E%3Ccircle cx=\'70\' cy=\'60\' r=\'1\' fill=\'rgba(255,255,255,0.07)\'/%3E%3Ccircle cx=\'20\' cy=\'80\' r=\'1\' fill=\'rgba(255,255,255,0.05)\'/%3E%3C/svg%3E") repeat',
          pointerEvents: 'none',
          opacity: 0.25
        }}
      />
      <Paper
        component={motion.div}
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        elevation={0}
        sx={{
          display: { xs: 'flex', md: 'flex' },
          flexDirection: 'column',
          gap: 3,
          p: { xs: 3, md: 6 },
          minHeight: { xs: 360, md: 640 },
          background: 'linear-gradient(180deg, #f7fbfa 0%, #eef8f6 100%)',
          color: '#0f172a',
          order: { md: 2 },
          borderLeft: { md: '1px solid #e5e7eb' }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#075e55' }}>
            Absensi Lebih Mudah
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Cepat, aman, dan terintegrasi untuk kebutuhan perusahaan Anda.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.25, py: 0.75, borderRadius: 2, bgcolor: 'rgba(7,128,133,0.08)' }}>
            <AccessTime sx={{ fontSize: 18, color: '#078085ff' }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#075e55' }}>Cepat</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.25, py: 0.75, borderRadius: 2, bgcolor: 'rgba(7,128,133,0.08)' }}>
            <Security sx={{ fontSize: 18, color: '#078085ff' }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#075e55' }}>Aman</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.25, py: 0.75, borderRadius: 2, bgcolor: 'rgba(7,128,133,0.08)' }}>
            <Face sx={{ fontSize: 18, color: '#078085ff' }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#075e55' }}>Face ID</Typography>
          </Box>
        </Box>
        <Box
          component={motion.svg}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          width="100%"
          height="380"
          viewBox="0 0 620 380"
        >
          <defs>
            <linearGradient id="illuGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e6fbf7" />
              <stop offset="100%" stopColor="#dff7f1" />
            </linearGradient>
            <radialGradient id="bgBlob" cx="0.5" cy="0.5" r="0.7">
              <stop offset="0%" stopColor="#eafaf6" />
              <stop offset="100%" stopColor="#f6fbf9" />
            </radialGradient>
          </defs>
          <ellipse cx="310" cy="190" rx="280" ry="160" fill="url(#bgBlob)" />
          <rect x="160" y="150" width="240" height="150" rx="18" fill="url(#illuGrad)" stroke="#8fd3c6" strokeWidth="2" />
          <rect x="178" y="168" width="110" height="16" rx="8" fill="#68c9b8" opacity="0.6" />
          <rect x="178" y="194" width="200" height="18" rx="9" fill="#39b6a1" opacity="0.4" />
          <rect x="178" y="220" width="130" height="22" rx="11" fill="#8fd3c6" opacity="0.35" />
          <rect x="148" y="248" width="30" height="28" rx="6" fill="#d8f3ec" />
          <path d="M163 248 C158 238 148 233 153 248 Z" fill="#5cc9b1" />
          <path d="M172 248 C168 236 158 234 164 250 Z" fill="#49b39f" />
          <circle cx="470" cy="120" r="36" fill="#c0eae0" stroke="#39b6a1" strokeWidth="2" />
          <line x1="470" y1="120" x2="470" y2="98" stroke="#0f766e" strokeWidth="3" />
          <line x1="470" y1="120" x2="492" y2="120" stroke="#0f766e" strokeWidth="3" />
          <rect x="440" y="176" width="118" height="116" rx="12" fill="#e6faf5" stroke="#39b6a1" strokeWidth="2" />
          <rect x="452" y="193" width="86" height="12" rx="6" fill="#8fd3c6" opacity="0.6" />
          <rect x="452" y="214" width="90" height="12" rx="6" fill="#8fd3c6" opacity="0.4" />
          <rect x="452" y="235" width="80" height="12" rx="6" fill="#8fd3c6" opacity="0.3" />
          <rect x="470" y="255" width="38" height="32" rx="6" fill="#d8f3ec" />
          <circle cx="488" cy="271" r="7" fill="#39b6a1" />
          <g transform="translate(365,175)">
            <circle cx="0" cy="0" r="12" fill="#3aa59b" />
            <rect x="-10" y="12" width="20" height="32" rx="6" fill="#58c2b3" />
            <rect x="-16" y="44" width="12" height="26" rx="6" fill="#58c2b3" />
            <rect x="4" y="44" width="12" height="26" rx="6" fill="#58c2b3" />
            <rect x="-22" y="22" width="18" height="12" rx="6" fill="#3aa59b" transform="rotate(-15)" />
            <rect x="-38" y="18" width="18" height="12" rx="3" fill="#e6faf5" stroke="#39b6a1" />
            <circle cx="-30" cy="24" r="3" fill="#39b6a1" />
          </g>
          <rect x="120" y="290" width="380" height="16" rx="8" fill="#d8f3ec" />
        </Box>
      </Paper>
      <Box
        component={motion.svg}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        width="100%"
        height="120"
        viewBox="0 0 1200 120"
        sx={{ position: 'absolute', bottom: -10, left: 0, right: 0, zIndex: 0 }}
      >
        <defs>
          <linearGradient id="viewportWave" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#168a70" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0f4c3f" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path d="M0 80 C200 20 400 120 600 70 C700 50 900 95 1200 80" fill="none" stroke="url(#viewportWave)" strokeWidth="10" strokeLinecap="round" />
      </Box>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        elevation={0}
        sx={{
          px: 7,
          py: 7,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#ffffff',
          width: '100%',
          minHeight: 640,
          borderRight: { md: '1px solid #e5e7eb' },
          order: { md: 1 },
          maxWidth: 480
        }}
      >
        {/* Logo dan Header */}
        <Box
          component={motion.div}
          variants={containerVariants}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 5,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Avatar
            component={motion.div}
            variants={itemVariants}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            sx={{
              m: 1,
              bgcolor: '#078085ff',
              width: 64,
              height: 64,
              mb: 2,
              boxShadow: '0 4px 6px -1px rgba(7, 128, 133, 0.4)',
            }}
          >
            <Business sx={{ fontSize: 32, color: '#ffffff' }} />
          </Avatar>
          <Box component={motion.div} variants={itemVariants} sx={{ width: '100%' }}>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#0f172a',
                mb: 1,
              }}
            >
              Login Sistem Absensi
            </Typography>
          </Box>
          <Box component={motion.div} variants={itemVariants} sx={{ width: '100%' }}>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              Silakan masuk untuk melakukan absensi
            </Typography>
          </Box>
        </Box>


        {/* Error Alert */}
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

        {/* Form */}
        <Box
          component={motion.form}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          sx={{ width: '100%' }}
        >
          <Box component={motion.div} variants={itemVariants}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={t('login.username')}
              name="username"
              autoComplete="username"
              autoFocus
              value={credentials.username}
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
                  borderRadius: 3,
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  transition: 'all 0.2s',
                  '&:hover fieldset': { borderColor: '#078085ff' },
                  '&.Mui-focused fieldset': { borderColor: '#078085ff' },
                }
              }}
            />
          </Box>
          <Box component={motion.div} variants={itemVariants}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('login.password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: '#64748b' }} />
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
                  borderRadius: 3,
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  transition: 'all 0.2s',
                  '&:hover fieldset': { borderColor: '#078085ff' },
                  '&.Mui-focused fieldset': { borderColor: '#078085ff' },
                }
              }}
            />
          </Box>
          <Box component={motion.div} variants={itemVariants} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: '#64748b' }}
                />
              }
              label="Ingat saya"
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            component={motion.button}
            variants={itemVariants}
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('login.submit')
            )}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            component={RouterLink}
            to="/register"
            sx={{
              mb: 2,
              py: 1.25,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              borderColor: '#078085ff',
              color: '#078085ff',
              '&:hover': {
                borderColor: '#066d71',
                bgcolor: 'rgba(7, 128, 133, 0.06)',
              },
            }}
          >
            Daftar Akun
          </Button>

          <Box component={motion.div} variants={itemVariants} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              © Absensi App
            </Typography>
          </Box>
        </Box>
      </Paper>
      </Box>
    </Box>
  );
};

export default Login;
