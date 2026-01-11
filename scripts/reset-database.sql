-- ======================================
-- RESET DATABASE VÀ INSERT DỮ LIỆU MỚI
-- ======================================

USE CustomerManagement;
GO

-- Xóa data theo thứ tự (foreign key constraints)
DELETE FROM dbo.reminders;
DELETE FROM dbo.activities;
DELETE FROM dbo.deals;
DELETE FROM dbo.customers;
DELETE FROM dbo.users;
GO

-- Reset identity
DBCC CHECKIDENT ('reminders', RESEED, 0);
DBCC CHECKIDENT ('activities', RESEED, 0);
DBCC CHECKIDENT ('deals', RESEED, 0);
DBCC CHECKIDENT ('customers', RESEED, 0);
DBCC CHECKIDENT ('users', RESEED, 0);
GO
