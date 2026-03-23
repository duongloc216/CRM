-- Script để thêm dữ liệu doanh thu cho 3 tháng gần đây
-- Mục đích: Hiển thị biểu đồ doanh thu theo tháng đầy đủ hơn
-- Chạy script này AFTER insert-sample-data.sql

USE [CustomerManagement];
GO

-- Bước 1: Update một số deals hiện tại để có actual_close_date ở tháng 12/2025
UPDATE [dbo].[deals] 
SET actual_close_date = '2025-12-15' 
WHERE id IN (
  SELECT TOP 3 id 
  FROM [dbo].[deals] 
  WHERE stage = 'won' AND actual_close_date IS NULL
);

-- Bước 2: Thêm 3 deals won mới cho tháng 12/2025
INSERT INTO dbo.deals (title, customer_id, value, stage, probability, expected_close_date, actual_close_date, description, owner_id, created_at) VALUES
  (N'Gói Premium Q4', 12, 18500000, N'won', 100, '2025-12-20', '2025-12-18', N'Deal đóng thành công tháng 12', 2, '2025-12-01 10:00:00'),
  (N'Giải pháp Marketing', 28, 12300000, N'won', 100, '2025-12-25', '2025-12-22', N'Deal đóng thành công tháng 12', 3, '2025-12-05 14:30:00'),
  (N'Tư vấn Digital', 34, 9800000, N'won', 100, '2025-12-28', '2025-12-27', N'Deal đóng thành công tháng 12', 2, '2025-12-10 09:15:00');

-- Bước 3: Thêm 3 deals won mới cho tháng 11/2025
INSERT INTO dbo.deals (title, customer_id, value, stage, probability, expected_close_date, actual_close_date, description, owner_id, created_at) VALUES
  (N'Gói Standard Q4', 15, 8500000, N'won', 100, '2025-11-18', '2025-11-16', N'Deal đóng thành công tháng 11', 3, '2025-11-01 11:00:00'),
  (N'Dịch vụ SEO', 22, 15200000, N'won', 100, '2025-11-22', '2025-11-20', N'Deal đóng thành công tháng 11', 2, '2025-11-03 13:45:00'),
  (N'Website Development', 41, 22000000, N'won', 100, '2025-11-28', '2025-11-25', N'Deal đóng thành công tháng 11', 3, '2025-11-08 16:00:00');

GO

-- Verify kết quả
SELECT 
  MONTH(actual_close_date) as Thang,
  YEAR(actual_close_date) as Nam,
  COUNT(*) as SoDeals,
  SUM(value) as TongDoanhThu
FROM [dbo].[deals]
WHERE stage = 'won' AND actual_close_date IS NOT NULL
GROUP BY MONTH(actual_close_date), YEAR(actual_close_date)
ORDER BY Nam DESC, Thang DESC;

-- Kết quả mong đợi:
-- Tháng 1/2026: 10 deals + 113,903,600 VNĐ
-- Tháng 12/2025: 3-6 deals + ~40,600,000 VNĐ
-- Tháng 11/2025: 3 deals + ~45,700,000 VNĐ
