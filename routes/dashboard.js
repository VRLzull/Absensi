const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const { verifyToken } = require("../middleware/auth");

// -------------------- API STATS --------------------
router.get("/stats", verifyToken, async (req, res) => {
  try {
    if (req.user.role === 'student') {
      // Get student-specific stats
      // We need to find the employee_record_id first
      const [userRows] = await pool.query(
        "SELECT employee_record_id FROM admin_users WHERE id = ?",
        [req.user.id]
      );
      
      const employeeId = userRows[0]?.employee_record_id;
      
      if (!employeeId) {
        return res.json({
          totalAttendance: 0,
          presentCount: 0,
          lateCount: 0,
          absentCount: 0,
          isStudent: true
        });
      }

      const [stats] = await pool.query(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status='present' THEN 1 ELSE 0 END) as present,
          SUM(CASE WHEN status='late' THEN 1 ELSE 0 END) as late
         FROM attendance 
         WHERE employee_id = ?`,
        [employeeId]
      );

      return res.json({
        totalAttendance: stats[0].total,
        presentCount: stats[0].present,
        lateCount: stats[0].late,
        absentCount: 0, // Simplified for student
        isStudent: true
      });
    }

    // Admin stats
    const [totalEmployees] = await pool.query(
      "SELECT COUNT(*) AS total FROM employees"
    );

    const [presentToday] = await pool.query(
      "SELECT COUNT(*) AS total FROM attendance WHERE DATE(check_in) = CURDATE() AND status IN ('present','late')"
    );

    const [lateToday] = await pool.query(
      "SELECT COUNT(*) AS total FROM attendance WHERE DATE(check_in) = CURDATE() AND status='late'"
    );

    const absentToday =
      totalEmployees[0].total - presentToday[0].total;

    res.json({
      totalEmployees: totalEmployees[0].total,
      presentToday: presentToday[0].total,
      absentToday,
      lateToday: lateToday[0].total,
      systemStatus: "online",
      isStudent: false
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------- API RECENT --------------------
router.get("/recent", verifyToken, async (req, res) => {
  try {
    let query, params;
    
    if (req.user.role === 'student') {
      const [userRows] = await pool.query(
        "SELECT employee_record_id FROM admin_users WHERE id = ?",
        [req.user.id]
      );
      const employeeId = userRows[0]?.employee_record_id;
      
      query = `SELECT a.id, e.full_name, e.department, a.check_in, a.status
               FROM attendance a
               JOIN employees e ON a.employee_id = e.id
               WHERE a.employee_id = ?
               ORDER BY a.check_in DESC
               LIMIT 10`;
      params = [employeeId];
    } else {
      query = `SELECT a.id, e.full_name, e.department, a.check_in, a.status
               FROM attendance a
               JOIN employees e ON a.employee_id = e.id
               ORDER BY a.check_in DESC
               LIMIT 10`;
      params = [];
    }
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching recent attendance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------- API WEEKLY CHART --------------------
router.get("/chart", verifyToken, async (req, res) => {
    try {
      if (req.user.role === 'student') {
        const [userRows] = await pool.query(
          "SELECT employee_record_id FROM admin_users WHERE id = ?",
          [req.user.id]
        );
        const employeeId = userRows[0]?.employee_record_id;

        if (!employeeId) {
          return res.json([]);
        }

        const [rows] = await pool.query(
          `SELECT 
              DATE(check_in) as date,
              SUM(CASE WHEN status='present' THEN 1 ELSE 0 END) as present,
              SUM(CASE WHEN status='late' THEN 1 ELSE 0 END) as late
           FROM attendance
           WHERE employee_id = ? AND check_in >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
           GROUP BY DATE(check_in)`,
          [employeeId]
        );

        const map = {};
        rows.forEach(r => {
          map[r.date.toISOString().split("T")[0]] = r;
        });

        const formatted = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toISOString().split("T")[0];
          const r = map[key] || { present: 0, late: 0 };

          formatted.push({
            day: d.toLocaleDateString("id-ID", { weekday: "short" }),
            present: r.present || 0,
            late: r.late || 0,
          });
        }
        return res.json(formatted);
      }

      // Admin logic
      const [totalEmployees] = await pool.query(
        "SELECT COUNT(*) AS total FROM employees"
      );
      const total = totalEmployees[0].total;
  
      const [rows] = await pool.query(
        `SELECT 
            DATE(check_in) as date,
            SUM(CASE WHEN status='present' THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN status='late' THEN 1 ELSE 0 END) as late
         FROM attendance
         WHERE check_in >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         GROUP BY DATE(check_in)`
      );
  
      const map = {};
      rows.forEach(r => {
        map[r.date.toISOString().split("T")[0]] = r;
      });
  
      const formatted = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
  
        const r = map[key] || { present: 0, late: 0 };
        const hadir = r.present + r.late;
        const absent = Math.max(total - hadir, 0);
  
        formatted.push({
          day: d.toLocaleDateString("id-ID", { weekday: "short" }),
          present: r.present || 0,
          late: r.late || 0,
          absent,
        });
      }
  
      res.json(formatted);
    } catch (err) {
      console.error("Error fetching weekly chart:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

module.exports = router;
