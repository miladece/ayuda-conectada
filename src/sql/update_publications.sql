-- Add is_active column to publications table with default value true
ALTER TABLE publications ADD COLUMN is_active BOOLEAN DEFAULT true;