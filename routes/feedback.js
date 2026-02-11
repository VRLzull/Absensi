const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken, requireRole } = require('../middleware/auth');

async function getResponseColumn() {
  const [cols] = await pool.execute(`
    SELECT COLUMN_NAME 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'feedback'
  `);
  const hasTanggapan = cols.some(c => c.COLUMN_NAME === 'tanggapan');
  return hasTanggapan ? 'tanggapan' : 'admin_response';
}

async function ensureResponsesTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS feedback_responses (
      id INT PRIMARY KEY AUTO_INCREMENT,
      feedback_id INT NOT NULL,
      admin_id INT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_feedback_resp_feedback
        FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE,
      CONSTRAINT fk_feedback_resp_admin
        FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB
  `;
  await pool.execute(sql);
}

// Get all feedback (filtered by role)
router.get('/', verifyToken, async (req, res) => {
  try {
    const responseCol = await getResponseColumn();
    const { role, id } = req.user;
    const { status, category, startDate, endDate, q, userId, username } = req.query;
    
    let query = `
      SELECT f.*, f.${responseCol} AS admin_response, u.full_name as student_name, u.username
      FROM feedback f
      JOIN admin_users u ON f.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // If student, only show their own feedback
    if (role === 'student') {
      query += ' AND f.user_id = ?';
      params.push(id);
    }

    // Admin filter by specific user
    if (role !== 'student' && userId) {
      query += ' AND f.user_id = ?';
      params.push(userId);
    }

    if (status) {
      query += ' AND f.status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND f.category = ?';
      params.push(category);
    }

    if (startDate) {
      query += ' AND DATE(f.created_at) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND DATE(f.created_at) <= ?';
      params.push(endDate);
    }

    // Text search across title/description and student name/username
    if (q) {
      query += ' AND (f.title LIKE ? OR f.description LIKE ? OR u.full_name LIKE ? OR u.username LIKE ?)';
      const like = `%${q}%`;
      params.push(like, like, like, like);
    }

    // Filter by username (admin only)
    if (role !== 'student' && username) {
      query += ' AND u.username LIKE ?';
      params.push(`%${username}%`);
    }

    query += ' ORDER BY f.created_at DESC';

    const [rows] = await pool.execute(query, params);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create feedback (All roles)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { category, title, description } = req.body;

    if (!category || !title || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
      INSERT INTO feedback (user_id, category, title, description)
      VALUES (?, ?, ?, ?)
    `;
    
    await pool.execute(query, [id, category, title, description]);

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update feedback (Admin can update all, Student can update own title/description)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const responseCol = await getResponseColumn();
    const { id } = req.params;
    const { role, id: userId } = req.user;
    const { status, admin_response, title, description, category, estimated_duration } = req.body;

    // First check if feedback exists
    const [existing] = await pool.execute('SELECT * FROM feedback WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Check ownership if student
    if (role === 'student') {
      if (existing[0].user_id !== userId) {
        return res.status(403).json({ error: 'Akses ditolak' });
      }

      // Student only updates content
      const query = `
        UPDATE feedback 
        SET title = ?, description = ?, category = ?
        WHERE id = ?
      `;
      await pool.execute(query, [
        title || existing[0].title, 
        description || existing[0].description, 
        category || existing[0].category, 
        id
      ]);
    } else {
      let inProgressAt = existing[0].in_progress_at;
      let resolvedAt = existing[0].resolved_at;

      // Update timestamps based on status change
      if (status === 'in_progress' && existing[0].status !== 'in_progress') {
        inProgressAt = new Date();
      } else if (status === 'resolved' && existing[0].status !== 'resolved') {
        resolvedAt = new Date();
      }

      const query = `
        UPDATE feedback 
        SET status = ?, ${responseCol} = ?, title = ?, description = ?, category = ?, 
            estimated_duration = ?, in_progress_at = ?, resolved_at = ?
        WHERE id = ?
      `;
      await pool.execute(query, [
        status || existing[0].status, 
        admin_response !== undefined ? admin_response : existing[0][responseCol], 
        title || existing[0].title, 
        description || existing[0].description, 
        category || existing[0].category, 
        estimated_duration !== undefined ? estimated_duration : existing[0].estimated_duration,
        inProgressAt,
        resolvedAt,
        id
      ]);
    }

    res.json({
      success: true,
      message: 'Feedback updated successfully'
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete feedback (Admin can delete all, Student can delete own)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    
    if (role === 'student') {
      const [ownerRows] = await pool.execute(
        'SELECT user_id FROM feedback WHERE id = ?',
        [id]
      );
      if (ownerRows.length === 0 || ownerRows[0].user_id !== userId) {
        return res.status(403).json({ error: 'Akses ditolak' });
      }
    }

    await pool.execute('DELETE FROM feedback WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get responses for a feedback (role-based view)
router.get('/:id/responses', verifyToken, async (req, res) => {
  try {
    const responseCol = await getResponseColumn();
    await ensureResponsesTable();
    const { id: feedbackId } = req.params;
    const { role, id: userId } = req.user;

    // If student, ensure they own the feedback
    if (role === 'student') {
      const [ownerRows] = await pool.execute(
        'SELECT user_id FROM feedback WHERE id = ?',
        [feedbackId]
      );
      if (ownerRows.length === 0 || ownerRows[0].user_id !== userId) {
        return res.status(403).json({ error: 'Akses ditolak' });
      }
    }

    const [rows] = await pool.execute(
      `SELECT r.id, r.message, r.created_at, a.full_name as admin_name, a.username as admin_username
       FROM feedback_responses r
       JOIN admin_users a ON r.admin_id = a.id
       WHERE r.feedback_id = ?
       ORDER BY r.created_at ASC`,
      [feedbackId]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get responses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add response (All roles can respond to allowed feedback)
router.post('/:id/responses', verifyToken, async (req, res) => {
  try {
    const responseCol = await getResponseColumn();
    await ensureResponsesTable();
    const { id: feedbackId } = req.params;
    const { role, id: userId } = req.user;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If student, ensure they own the feedback
    if (role === 'student') {
      const [ownerRows] = await pool.execute(
        'SELECT user_id FROM feedback WHERE id = ?',
        [feedbackId]
      );
      if (ownerRows.length === 0 || ownerRows[0].user_id !== userId) {
        return res.status(403).json({ error: 'Akses ditolak' });
      }
    }

    await pool.execute(
      'INSERT INTO feedback_responses (feedback_id, admin_id, message) VALUES (?, ?, ?)',
      [feedbackId, userId, message.trim()]
    );

    // Only update main feedback's latest response column if admin is responding
    // or if we want the student's reply to also show up as the "latest response"
    // Let's update it for both so the preview shows the very last message.
    const sql = `UPDATE feedback SET ${responseCol} = ? WHERE id = ?`;
    await pool.execute(sql, [message.trim(), feedbackId]);

    res.status(201).json({ success: true, message: 'Response added successfully' });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete response (Admin can delete all, User can delete own)
router.delete('/responses/:responseId', verifyToken, async (req, res) => {
  try {
    const { responseId } = req.params;
    const { role, id: userId } = req.user;

    if (role === 'student') {
      const [ownerRows] = await pool.execute(
        'SELECT admin_id FROM feedback_responses WHERE id = ?',
        [responseId]
      );
      if (ownerRows.length === 0 || ownerRows[0].admin_id !== userId) {
        return res.status(403).json({ error: 'Akses ditolak' });
      }
    }

    await pool.execute('DELETE FROM feedback_responses WHERE id = ?', [responseId]);
    res.json({ success: true, message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Delete response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
