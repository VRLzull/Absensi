-- Migration to add time tracking to feedback table
ALTER TABLE feedback 
ADD COLUMN in_progress_at TIMESTAMP NULL AFTER status,
ADD COLUMN resolved_at TIMESTAMP NULL AFTER in_progress_at,
ADD COLUMN estimated_duration VARCHAR(100) NULL AFTER resolved_at;
