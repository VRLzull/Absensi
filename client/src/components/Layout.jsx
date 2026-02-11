import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Schedule,
  Face,
  Assessment,
  Settings,
  Person,
  Logout,
  ChevronLeft,
  Notifications,
  Comment,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useThemeContext } from '../contexts/ThemeContext';
import { useTranslation } from '../utils/translations';
import { motion } from 'framer-motion';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { language, colors } = useThemeContext();
  const { t } = useTranslation(language);

  // Filter menu items based on role
  const menuItems = [
    { text: t('nav.dashboard'), icon: <Dashboard />, path: '/dashboard', roles: ['super_admin', 'admin', 'student'] },
    { text: t('employees.title'), icon: <People />, path: '/employees', roles: ['super_admin', 'admin'] },
    { text: t('nav.attendance'), icon: <Schedule />, path: '/attendance', roles: ['super_admin', 'admin', 'student'] },
    { text: t('nav.feedback'), icon: <Comment />, path: '/feedback', roles: ['super_admin', 'admin'] },
    { text: language === 'id' ? 'Pendaftaran Wajah' : 'Face Registration', icon: <Face />, path: '/face-registration', roles: ['super_admin', 'admin'] },
    { text: t('nav.reports'), icon: <Assessment />, path: '/reports', roles: ['super_admin', 'admin'] },
    { text: t('nav.settings'), icon: <Settings />, path: '/settings', roles: ['super_admin', 'admin'] },
  ].filter(item => !item.roles || item.roles.includes(user?.role));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Avatar
          sx={{
            mr: 2,
            bgcolor: '#078085ff',
            width: 40,
            height: 40,
            boxShadow: '0 4px 6px -1px rgba(7, 128, 133, 0.4)',
          }}
        >
          <Face sx={{ fontSize: 24, color: '#ffffff' }} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
          Absensi App
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              button
              component={motion.div}
              whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              whileTap={{ scale: 0.98 }}
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: isActive ? 'rgba(7, 128, 133, 0.15)' : 'transparent',
                color: isActive ? '#078085ff' : 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.2s',
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive ? '#078085ff' : 'inherit',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.95rem'
                }} 
              />
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ 
          p: 2, 
          borderRadius: 3, 
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Avatar 
            src={user?.photo_path ? `http://localhost:5000/uploads/profiles/${user.photo_path}` : undefined}
            sx={{ width: 40, height: 40, mr: 2, bgcolor: '#078085ff' }}
          >
            {user?.full_name?.charAt(0)}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
              {user?.full_name}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: 'rgba(255, 255, 255, 0.5)', textTransform: 'capitalize' }}>
              {user?.role?.replace('_', ' ')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <AppBar
        position="fixed"
        elevation={0}
        component={motion.div}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e2e8f0',
          color: '#1e293b',
        }}
      >
        <Toolbar
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          sx={{ justifyContent: 'space-between' }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={handleNotificationOpen}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge badgeContent={4} color="error">
                <Notifications sx={{ color: '#64748b' }} />
              </Badge>
            </IconButton>
            
            <IconButton
              onClick={handleMenuOpen}
              sx={{ p: 0.5, border: '1px solid #e2e8f0', borderRadius: 2 }}
              component={motion.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Avatar 
                src={user?.photo_path ? `http://localhost:5000/uploads/profiles/${user.photo_path}` : undefined}
                sx={{ width: 32, height: 32, bgcolor: '#078085ff' }}
              >
                {user?.full_name?.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 180,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                backgroundColor: colors.card,
                color: colors.textPrimary,
              },
            }}
          >
            <MenuItem onClick={() => { handleNavigation('/profile'); handleMenuClose(); }}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              {t('nav.profile')}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              {t('nav.logout')}
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 300,
                maxHeight: 400,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                backgroundColor: colors.card,
                color: colors.textPrimary,
              },
            }}
          >
            <MenuItem>
              <Typography variant="body2">
                {language === 'id' ? 'Belum ada notifikasi' : 'No notifications'}
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: colors.sidebar,
              color: colors.sidebarText,
              borderRight: `1px solid ${colors.border}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: colors.sidebar,
              color: colors.sidebarText,
              borderRight: `1px solid ${colors.border}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component={motion.main}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: '100vh',
          backgroundColor: colors.background,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
