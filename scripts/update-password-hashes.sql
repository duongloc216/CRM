-- SQL UPDATE Script to fix BUG_001
-- Generated: 2026-01-13T06:16:55.304Z
-- Purpose: Replace plain text passwords with bcrypt hashes
-- Run this script to enable login with demo passwords

USE [CustomerManagement];
GO

UPDATE [dbo].[users] SET password_hash = '$2b$10$nvBYpBNnbS5FcLELFEc2uud47/ud8z9pgqdEZXaTy6S4.woVC6gZm' WHERE id = 1; -- admin123
UPDATE [dbo].[users] SET password_hash = '$2b$10$6ODxQEo4rbJQGYmntSppgO.xHOUnS1uliDxXtofiZy0ciigEQwLz2' WHERE id = 2; -- sales123
UPDATE [dbo].[users] SET password_hash = '$2b$10$rQSrGH3VqE8SanD8octHDOscWHgMRPtRkX2oEhjPnHlYseqqPWnnG' WHERE id = 3; -- sales123
UPDATE [dbo].[users] SET password_hash = '$2b$10$/aDU8T5jdWfqj4T5rfbHauUzCEG2W9hZr6KwL7gxcNM/QO7rXXbWK' WHERE id = 4; -- marketing123

-- Verify the update
SELECT id, name, email, password_hash, role 
FROM [dbo].[users]
ORDER BY id;

-- After running this script, you can login with:
-- nva@example.com / admin123
-- ttb@example.com / sales123
-- lvc@example.com / sales123
-- ptd@example.com / marketing123
