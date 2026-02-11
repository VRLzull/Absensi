import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  FileDownload as ExcelIcon,
  Chat as ChatIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../utils/translations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import PageTransition from '../components/PageTransition';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openResponseDialog, setOpenResponseDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: ''
  });
  const [responseData, setResponseData] = useState({
    status: '',
    admin_response: '',
    estimated_duration: ''
  });
  const [responses, setResponses] = useState([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [newResponse, setNewResponse] = useState('');
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    status: '',
    category: '',
    startDate: '',
    endDate: '',
    exportMethod: 'excel'
  });

  const [filters, setFilters] = useState({
    status: '',
    category: '',
    startDate: '',
    endDate: '',
    q: '',
    username: '',
    month: ''
  });

  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    fetchFeedbacks();
    setPage(1);
  }, [filters]);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.q) params.append('q', filters.q);
      if (filters.username) params.append('username', filters.username);

      const response = await axios.get(`http://localhost:5000/api/feedback?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setFeedbacks(response.data.data);
        setPage(1);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (selectedFeedback) {
        // Update logic (title, description, category)
        await axios.put(`http://localhost:5000/api/feedback/${selectedFeedback.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create logic
        await axios.post('http://localhost:5000/api/feedback', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setOpenDialog(false);
      setFormData({ category: '', title: '', description: '' });
      setSelectedFeedback(null);
      fetchFeedbacks();
      Swal.fire('Success', selectedFeedback ? 'Feedback updated successfully' : 'Feedback submitted successfully', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to save feedback', 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/feedback/${selectedFeedback.id}`, responseData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenResponseDialog(false);
      fetchFeedbacks();
      Swal.fire('Success', 'Feedback updated successfully', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to update feedback', 'error');
    }
  };

  const fetchResponses = async (feedbackId) => {
    try {
      setLoadingResponses(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/feedback/${feedbackId}/responses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setResponses(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoadingResponses(false);
    }
  };

  const handleAddResponse = async () => {
    try {
      if (!newResponse.trim()) return;
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/feedback/${selectedFeedback.id}/responses`, {
        message: newResponse.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const latest = newResponse.trim();
      setNewResponse('');
      setResponseData(prev => ({ ...prev, admin_response: latest }));
      setSelectedFeedback(prev => prev ? { ...prev, admin_response: latest } : prev);
      fetchResponses(selectedFeedback.id);
      fetchFeedbacks();
      Swal.fire('Success', 'Response added', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to add response', 'error');
    }
  };

  const handleDeleteResponse = async (responseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/feedback/responses/${responseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResponses(prev => prev.filter(r => r.id !== responseId));
    } catch (error) {
      Swal.fire('Error', 'Failed to delete response', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/feedback/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchFeedbacks();
        Swal.fire('Deleted!', 'Feedback has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete feedback', 'error');
      }
    }
  };

  const exportPDF = (dataToExport) => {
    const doc = new jsPDF();
    doc.text('Laporan Feedback Absensi', 14, 15);
    
    const tableColumn = ["Tanggal", "Pengirim", "Kategori", "Subjek", "Status", "Estimasi", "Tanggapan"];
    const tableRows = dataToExport.map(item => [
      new Date(item.created_at).toLocaleDateString(),
      item.student_name || item.username || '-',
      item.category,
      item.title,
      item.status,
      item.estimated_duration || '-',
      item.admin_response || '-'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save('laporan_feedback.pdf');
  };

  const exportExcel = (dataToExport) => {
    const tableColumn = ["Tanggal", "Pengirim", "Kategori", "Subjek", "Deskripsi", "Status", "Estimasi", "Tanggapan"];
    const tableRows = dataToExport.map(item => [
      new Date(item.created_at).toLocaleString('id-ID'),
      item.student_name || item.username || '-',
      item.category,
      item.title,
      item.description,
      item.status,
      item.estimated_duration || '-',
      item.admin_response || '-'
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([tableColumn, ...tableRows]);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Tanggal
      { wch: 20 }, // Pengirim
      { wch: 15 }, // Kategori
      { wch: 25 }, // Subjek
      { wch: 40 }, // Deskripsi
      { wch: 12 }, // Status
      { wch: 15 }, // Estimasi
      { wch: 40 }, // Tanggapan
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Feedback");
    XLSX.writeFile(wb, "laporan_feedback.xlsx");
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (exportFilters.status) params.append('status', exportFilters.status);
      if (exportFilters.category) params.append('category', exportFilters.category);
      if (exportFilters.startDate) params.append('startDate', exportFilters.startDate);
      if (exportFilters.endDate) params.append('endDate', exportFilters.endDate);

      const response = await axios.get(`http://localhost:5000/api/feedback?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data.data;
        if (data.length === 0) {
          Swal.fire('Info', 'Tidak ada data untuk diekspor dengan filter ini', 'info');
          return;
        }

        if (exportFilters.exportMethod === 'pdf') {
          exportPDF(data);
        } else {
          exportExcel(data);
        }
        setOpenExportDialog(false);
      }
    } catch (error) {
      console.error('Export error:', error);
      Swal.fire('Error', 'Gagal mengekspor data', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <PageTransition>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{t('feedback.title')}</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {
              setExportFilters({
                ...exportFilters,
                status: filters.status,
                category: filters.category,
                startDate: filters.startDate,
                endDate: filters.endDate
              });
              setOpenExportDialog(true);
            }}
            sx={{ mr: 2 }}
          >
            Export Data
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedFeedback(null);
              setFormData({ category: '', title: '', description: '' });
              setOpenDialog(true);
            }}
          >
            {t('feedback.add')}
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Absensi">Absensi</MenuItem>
              <MenuItem value="Aplikasi">Aplikasi</MenuItem>
              <MenuItem value="Jadwal">Jadwal</MenuItem>
              <MenuItem value="Sarana & Prasarana">Sarana & Prasarana</MenuItem>
              <MenuItem value="Keamanan">Keamanan</MenuItem>
              <MenuItem value="Lainnya">Lainnya</MenuItem>
            </Select>
          </FormControl>

          {/* Bulan (preset range) */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Bulan</InputLabel>
            <Select
              value={filters.month}
              label="Bulan"
              onChange={(e) => {
                const m = e.target.value;
                if (!m) {
                  setFilters({ ...filters, month: '', startDate: '', endDate: '' });
                } else {
                  const year = new Date().getFullYear();
                  const start = new Date(year, Number(m) - 1, 1);
                  const end = new Date(year, Number(m), 0);
                  const fmt = (d) => d.toISOString().slice(0, 10);
                  setFilters({
                    ...filters,
                    month: m,
                    startDate: fmt(start),
                    endDate: fmt(end)
                  });
                }
              }}
            >
              <MenuItem value="">Semua</MenuItem>
              <MenuItem value="1">Januari</MenuItem>
              <MenuItem value="2">Februari</MenuItem>
              <MenuItem value="3">Maret</MenuItem>
              <MenuItem value="4">April</MenuItem>
              <MenuItem value="5">Mei</MenuItem>
              <MenuItem value="6">Juni</MenuItem>
              <MenuItem value="7">Juli</MenuItem>
              <MenuItem value="8">Agustus</MenuItem>
              <MenuItem value="9">September</MenuItem>
              <MenuItem value="10">Oktober</MenuItem>
              <MenuItem value="11">November</MenuItem>
              <MenuItem value="12">Desember</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />

          <TextField
            label="End Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />

          {/* Cari (subject/description/student) */}
          <TextField
            label="Cari"
            size="small"
            placeholder="Subjek/Deskripsi/Nama"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />

          {/* Per siswa (admin only) */}
          {user?.role !== 'student' && (
            <TextField
              label="Siswa"
              size="small"
              placeholder="Username/Nama"
              value={filters.username}
              onChange={(e) => setFilters({ ...filters, username: e.target.value })}
            />
          )}

          <Button 
            variant="outlined" 
            onClick={() => setFilters({ status: '', category: '', startDate: '', endDate: '' })}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              {user?.role !== 'student' && <TableCell>Student</TableCell>}
              <TableCell>Category</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>{t('feedback.response')}</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks
              .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
              .map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>{new Date(feedback.created_at).toLocaleDateString()}</TableCell>
                {user?.role !== 'student' && <TableCell>{feedback.student_name}</TableCell>}
                <TableCell>{feedback.category}</TableCell>
                <TableCell>{feedback.title}</TableCell>
                <TableCell>{feedback.description}</TableCell>
                <TableCell>{feedback.admin_response || '-'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Detail & Tanggapan">
                      <IconButton size="small" color="info" onClick={() => {
                        setSelectedFeedback(feedback);
                        setResponseData({
                          status: feedback.status,
                          admin_response: feedback.admin_response || '',
                          estimated_duration: feedback.estimated_duration || ''
                        });
                        setOpenResponseDialog(true);
                        fetchResponses(feedback.id);
                      }}>
                        <ChatIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    {(user?.role !== 'student' || feedback.user_id === user?.id) && (
                      <>
                        <Tooltip title="Edit Isi Laporan">
                          <IconButton size="small" color="primary" onClick={() => {
                            setSelectedFeedback(feedback);
                            setFormData({
                              category: feedback.category,
                              title: feedback.title,
                              description: feedback.description
                            });
                            setOpenDialog(true);
                          }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus Laporan">
                          <IconButton size="small" color="error" onClick={() => handleDelete(feedback.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={t(`feedback.status.${feedback.status}`)} 
                    color={getStatusColor(feedback.status)} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Paper sx={{ px: 1, py: 0.5, borderRadius: 3 }} elevation={0}>
          <ButtonGroup variant="text" size="small">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              sx={{ color: page === 1 ? '#94a3b8' : '#0f172a', textTransform: 'none', px: 1.5 }}
            >
              Previous
            </Button>
            {Array.from({ length: Math.max(1, Math.ceil(feedbacks.length / pageSize)) }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
              .map((p) => (
                <Button
                  key={p}
                  onClick={() => setPage(p)}
                  variant={p === page ? 'contained' : 'text'}
                  sx={{
                    textTransform: 'none',
                    mx: 0.25,
                    bgcolor: p === page ? '#1d4ed8' : 'transparent',
                    color: p === page ? '#ffffff' : '#0f172a'
                  }}
                >
                  {p}
                </Button>
              ))}
            <Button
              onClick={() => setPage((p) => Math.min(Math.ceil(feedbacks.length / pageSize) || 1, p + 1))}
              disabled={page >= (Math.ceil(feedbacks.length / pageSize) || 1)}
              sx={{ color: page >= (Math.ceil(feedbacks.length / pageSize) || 1) ? '#94a3b8' : '#0f172a', textTransform: 'none', px: 1.5 }}
            >
              Next
            </Button>
          </ButtonGroup>
        </Paper>
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => {
        setOpenDialog(false);
        setSelectedFeedback(null);
        setFormData({ category: '', title: '', description: '' });
      }} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedFeedback ? 'Edit Laporan' : t('feedback.add')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('feedback.subject')}
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>{t('feedback.category')}</InputLabel>
            <Select
              value={formData.category}
              label={t('feedback.category')}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <MenuItem value="Absensi">Absensi</MenuItem>
              <MenuItem value="Aplikasi">Aplikasi</MenuItem>
              <MenuItem value="Jadwal">Jadwal</MenuItem>
              <MenuItem value="Sarana & Prasarana">Sarana & Prasarana</MenuItem>
              <MenuItem value="Keamanan">Keamanan</MenuItem>
              <MenuItem value="Lainnya">Lainnya</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label={t('feedback.description')}
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            setSelectedFeedback(null);
          }}>{t('common.cancel')}</Button>
          <Button onClick={handleCreate} variant="contained">{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      {/* Response/Detail Dialog */}
      <Dialog open={openResponseDialog} onClose={() => setOpenResponseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detail & Tanggapan</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">Informasi Laporan</Typography>
            <Typography variant="body1"><strong>Subjek:</strong> {selectedFeedback?.title}</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}><strong>Kategori:</strong> {selectedFeedback?.category}</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}><strong>Deskripsi:</strong> {selectedFeedback?.description}</Typography>
            
            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
              <Typography variant="caption" display="block" color="text.secondary">{t('feedback.timeline')}:</Typography>
              <Typography variant="caption" display="block">
                🕒 <strong>{t('feedback.submitted')}:</strong> {selectedFeedback?.created_at ? new Date(selectedFeedback.created_at).toLocaleString('id-ID') : '-'}
              </Typography>
              {selectedFeedback?.in_progress_at && (
                <Typography variant="caption" display="block">
                  ⚙️ <strong>{t('feedback.processed')}:</strong> {new Date(selectedFeedback.in_progress_at).toLocaleString('id-ID')}
                </Typography>
              )}
              {selectedFeedback?.estimated_duration && (
                <Typography variant="caption" display="block" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  ⏳ <strong>{t('feedback.estimated')}:</strong> {selectedFeedback.estimated_duration}
                </Typography>
              )}
              {selectedFeedback?.resolved_at && (
                <Typography variant="caption" display="block">
                  ✅ <strong>{t('feedback.completed')}:</strong> {new Date(selectedFeedback.resolved_at).toLocaleString('id-ID')}
                </Typography>
              )}
            </Box>
          </Box>

          {user?.role !== 'student' && (
            <>
              <FormControl fullWidth margin="dense">
                <InputLabel>{t('feedback.status')}</InputLabel>
                <Select
                  value={responseData.status}
                  label={t('feedback.status')}
                  onChange={(e) => setResponseData({...responseData, status: e.target.value})}
                >
                  <MenuItem value="pending">{t('feedback.status.pending')}</MenuItem>
                  <MenuItem value="in_progress">{t('feedback.status.in_progress')}</MenuItem>
                  <MenuItem value="resolved">{t('feedback.status.resolved')}</MenuItem>
                  <MenuItem value="rejected">{t('feedback.status.rejected')}</MenuItem>
                </Select>
              </FormControl>
              
              {responseData.status === 'in_progress' && (
                <TextField
                  margin="dense"
                  label={t('feedback.estimated')}
                  fullWidth
                  value={responseData.estimated_duration}
                  onChange={(e) => setResponseData({...responseData, estimated_duration: e.target.value})}
                  placeholder={t('feedback.estimated_placeholder')}
                  helperText={t('feedback.estimated_helper')}
                />
              )}

              <TextField
                margin="dense"
                label="Ringkasan Tanggapan (Terlihat di Tabel)"
                fullWidth
                multiline
                rows={2}
                value={responseData.admin_response}
                onChange={(e) => setResponseData({...responseData, admin_response: e.target.value})}
              />
            </>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Riwayat Tanggapan</Typography>
            {loadingResponses ? (
              <Typography variant="body2">Memuat...</Typography>
            ) : responses.length === 0 ? (
              <Typography variant="body2">Belum ada tanggapan</Typography>
            ) : (
              <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                {responses.map((r) => (
                  <Paper key={r.id} sx={{ p: 1.5, mb: 1, bgcolor: r.admin_username === user?.username ? 'primary.light' : 'grey.100' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="caption" fontWeight="bold">
                        {r.admin_name} ({r.admin_username})
                      </Typography>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                          {new Date(r.created_at).toLocaleString('id-ID')}
                        </Typography>
                        {(user?.role !== 'student' || r.admin_username === user?.username) && (
                          <IconButton size="small" color="error" onClick={() => handleDeleteResponse(r.id)}>
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2">{r.message}</Typography>
                  </Paper>
                ))}
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Tulis tanggapan baru..."
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddResponse()}
              />
              <Button onClick={handleAddResponse} variant="contained">Kirim</Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenResponseDialog(false)} color="inherit">
            Tutup
          </Button>
          {user?.role !== 'student' && (
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Simpan Perubahan Status
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={openExportDialog} onClose={() => setOpenExportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon color="primary" />
          <Typography variant="h6">Export Laporan Feedback</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Pilih filter untuk mengekspor data feedback:
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={exportFilters.status}
                    label="Status"
                    onChange={(e) => setExportFilters({ ...exportFilters, status: e.target.value })}
                  >
                    <MenuItem value="">Semua Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    value={exportFilters.category}
                    label="Kategori"
                    onChange={(e) => setExportFilters({ ...exportFilters, category: e.target.value })}
                  >
                    <MenuItem value="">Semua Kategori</MenuItem>
                    <MenuItem value="Saran">Saran</MenuItem>
                    <MenuItem value="Keluhan">Keluhan</MenuItem>
                    <MenuItem value="Bug">Bug</MenuItem>
                    <MenuItem value="Lainnya">Lainnya</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dari Tanggal"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={exportFilters.startDate}
                  onChange={(e) => setExportFilters({ ...exportFilters, startDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sampai Tanggal"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={exportFilters.endDate}
                  onChange={(e) => setExportFilters({ ...exportFilters, endDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Metode Export</InputLabel>
                  <Select
                    value={exportFilters.exportMethod}
                    label="Metode Export"
                    onChange={(e) => setExportFilters({ ...exportFilters, exportMethod: e.target.value })}
                  >
                    <MenuItem value="excel">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ExcelIcon sx={{ color: '#1d6f42' }} fontSize="small" />
                        Microsoft Excel (.xlsx)
                      </Box>
                    </MenuItem>
                    <MenuItem value="pdf">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PdfIcon sx={{ color: '#d32f2f' }} fontSize="small" />
                        Adobe PDF (.pdf)
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenExportDialog(false)} color="inherit" disabled={exportLoading}>
            Batal
          </Button>
          <Button 
            onClick={handleExport} 
            variant="contained" 
            color="primary"
            startIcon={exportLoading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
            disabled={exportLoading}
          >
            {exportLoading ? 'Mengekspor...' : 'Export Sekarang'}
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </PageTransition>
  );
};

export default Feedback;
