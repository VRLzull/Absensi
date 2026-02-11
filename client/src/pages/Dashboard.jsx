import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  LinearProgress,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  People,
  CheckCircle,
  Error,
  Warning,
  Refresh,
  AccessTime,
  TrendingUp,
  History,
  Person,
} from '@mui/icons-material';
import {
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from 'recharts';
import { useTheme as useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const listItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    systemStatus: 'online',
    isStudent: false,
    totalAttendance: 0,
    presentCount: 0,
    lateCount: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState([]);
  const { colors, mode } = useThemeContext();
  const { user } = useAuth();
  
  // Calculate completion rate
  const completionRate = stats.totalAttendance > 0 
    ? Math.round((stats.presentCount / 20) * 100) // Assuming 20 working days/month target
    : 0;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);

      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // Ambil statistik dari API
      const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats', { headers });
      setStats(statsRes.data);

      // Ambil aktivitas terbaru dari API
      const recentRes = await axios.get('http://localhost:5000/api/dashboard/recent', { headers });
      setRecentAttendance(recentRes.data);

      // Ambil data chart mingguan dari API
      const chartRes = await axios.get("http://localhost:5000/api/dashboard/chart", { headers });
      setChartData(chartRes.data);


    } catch (error) {
      console.warn('Error loading dashboard data:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'late': return '#f59e0b';
      case 'absent': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <CheckCircle sx={{ color: '#10b981' }} />;
      case 'warning': return <Warning sx={{ color: '#f59e0b' }} />;
      case 'offline': return <Error sx={{ color: '#ef4444' }} />;
      default: return <AccessTime sx={{ color: '#6b7280' }} />;
    }
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'late': return '#f59e0b';
      case 'absent': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const cardBaseStyle = {
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    boxShadow: 'none',
    backgroundColor: colors.card,
    height: '100%',
    minHeight: 250,
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Skeleton variant="text" width={300} height={60} animation="wave" />
            <Skeleton variant="text" width={400} height={30} animation="wave" />
          </Box>
          <Skeleton variant="circular" width={40} height={40} animation="wave" />
        </Box>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} animation="wave" />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} animation="wave" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} animation="wave" />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <PageTransition>
      <Box 
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ flexGrow: 1, p: 3 }}
      >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            Selamat Datang, {user?.full_name}!
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            {stats.isStudent ? 'Berikut adalah ringkasan kehadiran Anda.' : 'Berikut adalah ringkasan absensi hari ini.'}
          </Typography>
        </Box>
        <Tooltip title="Segarkan Data">
          <IconButton 
            onClick={loadDashboardData} 
            disabled={refreshing}
            sx={{ 
              bgcolor: '#ffffff', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': { bgcolor: '#f8fafc' }
            }}
          >
            <Refresh className={refreshing ? 'spin-animation' : ''} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Completion Status Widget (New Feature) */}
      {stats.isStudent && (
        <Paper 
          component={motion.div}
          variants={itemVariants}
          sx={{ 
            p: 3, 
            mb: 4, 
            background: `linear-gradient(135deg, ${colors.primary || '#078085ff'} 0%, #0f4c75 100%)`,
            color: '#fff',
            borderRadius: 3
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Status Penyelesaian Absensi
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                Target kehadiran bulan ini: 20 Hari. Pertahankan konsistensi kehadiranmu!
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(completionRate, 100)} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#4ade80'
                      }
                    }} 
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {completionRate}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
               <Box sx={{ 
                 display: 'inline-flex', 
                 p: 2, 
                 bgcolor: 'rgba(255,255,255,0.15)', 
                 borderRadius: '50%',
                 backdropFilter: 'blur(10px)'
               }}>
                 <CheckCircle sx={{ fontSize: 40, color: '#4ade80' }} />
               </Box>
               <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 600 }}>
                 {completionRate >= 100 ? 'Target Tercapai!' : 'Dalam Progres'}
               </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.isStudent ? (
          <>
            <Grid item xs={12} sm={4}>
              <StatCard 
                title="Total Kehadiran" 
                value={stats.totalAttendance} 
                icon={<History sx={{ fontSize: 32 }} />} 
                color="#078085ff" 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard 
                title="Tepat Waktu" 
                value={stats.presentCount} 
                icon={<CheckCircle sx={{ fontSize: 32 }} />} 
                color="#10b981" 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard 
                title="Terlambat" 
                value={stats.lateCount} 
                icon={<Warning sx={{ fontSize: 32 }} />} 
                color="#f59e0b" 
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Total Karyawan" 
                value={stats.totalEmployees} 
                icon={<People sx={{ fontSize: 32 }} />} 
                color="#078085ff" 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Hadir" 
                value={stats.presentToday} 
                icon={<CheckCircle sx={{ fontSize: 32 }} />} 
                color="#10b981" 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Terlambat" 
                value={stats.lateToday} 
                icon={<Warning sx={{ fontSize: 32 }} />} 
                color="#f59e0b" 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Tidak Hadir" 
                value={stats.absentToday} 
                icon={<Error sx={{ fontSize: 32 }} />} 
                color="#ef4444" 
              />
            </Grid>
          </>
        )}

        {/* Chart & Recent Activity */}
        <Grid item xs={12} lg={8} component={motion.div} variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0f172a' }}>
              {stats.isStudent ? 'Aktivitas Kehadiran' : 'Tren Kehadiran Mingguan'}
            </Typography>
            <Box sx={{ height: 350, width: '100%' }}>
              <ResponsiveContainer>
                {stats.isStudent ? (
                  <AreaChart data={recentAttendance.map(a => ({ date: new Date(a.check_in).toLocaleDateString(), status: a.status === 'present' ? 1 : 0.5 }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="status" stroke="#078085ff" fill="rgba(7, 128, 133, 0.1)" strokeWidth={3} />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip />
                    <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4} component={motion.div} variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              height: '100%',
              maxHeight: 465,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0f172a' }}>
              Aktivitas Terbaru
            </Typography>
            <List 
              component={motion.ul}
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}
            >
              {recentAttendance.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem 
                    component={motion.li}
                    variants={listItemVariants}
                    sx={{ px: 0, py: 1.5 }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'rgba(7, 128, 133, 0.1)', color: '#078085ff' }}>
                        <Person />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.full_name}
                      secondary={new Date(item.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      primaryTypographyProps={{ fontWeight: 600, color: '#1e293b' }}
                    />
                    <Chip
                      label={item.status === 'present' ? 'Hadir' : 'Terlambat'}
                      size="small"
                      sx={{
                        bgcolor: item.status === 'present' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: item.status === 'present' ? '#10b981' : '#f59e0b',
                        fontWeight: 600,
                        borderRadius: 1.5
                      }}
                    />
                  </ListItem>
                  {index < recentAttendance.length - 1 && <Divider component="li" sx={{ borderStyle: 'dashed' }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
    </PageTransition>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    component={motion.div}
    variants={itemVariants}
    elevation={0}
    sx={{ 
      p: 3, 
      display: 'flex', 
      alignItems: 'center', 
      borderRadius: 4,
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }
    }}
  >
    <Box sx={{ 
      p: 1.5, 
      borderRadius: 3, 
      bgcolor: `${color}15`,
      color: color,
      mr: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

export default Dashboard;
