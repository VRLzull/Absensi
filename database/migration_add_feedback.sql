CREATE TABLE IF NOT EXISTS feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- Feedback responses (admin tanggapan riwayat)
CREATE TABLE IF NOT EXISTS feedback_responses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    feedback_id INT NOT NULL,
    admin_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
);
