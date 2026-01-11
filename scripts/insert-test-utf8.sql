USE CustomerManagement;
GO

DELETE FROM reminders;
DELETE FROM activities;
DELETE FROM deals;
DELETE FROM customers WHERE id > 0;
GO

DBCC CHECKIDENT ('customers', RESEED, 0);
DBCC CHECKIDENT ('deals', RESEED, 0);
GO

INSERT INTO dbo.customers (name, company, email, phone, status, created_by)
VALUES 
(N'Nguyễn Văn A', N'ABC Corp', N'test1@example.com', N'0901234567', N'active', 1),
(N'Trần Thị B', N'XYZ Ltd', N'test2@example.com', N'0909876543', N'prospect', 2);
GO

INSERT INTO dbo.deals (title, customer_id, value, stage, probability, expected_close_date, description, owner_id)
VALUES 
(N'Gói học thử', 1, 4260000, N'Đăng ký', 100, '2025-07-27', N'Khách hàng đăng ký Gói học thử', 2),
(N'Gói học chính thức', 2, 5000000, N'Đăng ký', 100, '2025-07-27', N'Khách hàng đăng ký Gói học chính thức', 2);
GO

-- Kiểm tra Unicode
SELECT id, stage, title, UNICODE(SUBSTRING(stage,1,1)) as unicode_D, UNICODE(SUBSTRING(title,1,1)) as unicode_G
FROM deals;
GO
