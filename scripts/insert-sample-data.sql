-- ======================================
-- GENERATED SAMPLE DATA
-- Date range: 2025-12-01 to 2026-01-27
-- ======================================

-- Users
DELETE FROM dbo.users;
DBCC CHECKIDENT ('users', RESEED, 0);
GO

INSERT INTO dbo.users (name, email, password_hash, role) VALUES
  (N'Nguyễn Văn A', 'nva@example.com', 'hash_pwd_1', 'admin'),
  (N'Trần Thị B', 'ttb@example.com', 'hash_pwd_2', 'sales'),
  (N'Lê Văn C', 'lvc@example.com', 'hash_pwd_3', 'sales'),
  (N'Phạm Thị D', 'ptd@example.com', 'hash_pwd_4', 'marketing');
GO

-- Customers (50)
DELETE FROM dbo.customers;
DBCC CHECKIDENT ('customers', RESEED, 0);
GO

INSERT INTO dbo.customers (name, company, email, phone, address, source, status, tags, total_value, last_contact, created_by) VALUES
  (N'Đặng Hà', N'ABC Corp', 'customer1@example.com', '0973689844', N'123 Đường C, Quận Phú Nhuận, TP.HCM', N'Email Campaign', 'inactive', N'Cold', 7372806, '2025-12-24 11:30:00', 2),
  (N'Đỗ Quân', N'Beta Systems', 'customer2@example.com', '0916381035', N'972 Đường B, Quận 1, TP.HCM', N'Referral', 'prospect', N'Khách hàng thân thiết,Hot,Cold', 12814605, '2025-12-28 13:15:00', 2),
  (N'Vũ Hà', N'VinaTech', 'customer3@example.com', '0981488923', N'669 Đường E, Quận 7, TP.HCM', N'Event', 'active', N'Cold,Tiềm năng', 3247941, '2026-01-25 13:00:00', 4),
  (N'Bùi Thảo', NULL, 'customer4@example.com', '0984278658', NULL, N'Event', 'active', N'Warm,Hot,VIP', 11369347, '2026-01-16 17:00:00', 4),
  (N'Hoàng Hoa', N'XYZ Ltd', 'customer5@example.com', '0947214842', N'283 Đường F, Quận 5, TP.HCM', N'Website', 'inactive', N'Hot,VIP,Cold', NULL, '2025-12-15 18:30:00', 2),
  (N'Dương Thảo', N'Beta Systems', 'customer6@example.com', '0976491857', NULL, N'Referral', 'prospect', N'Tiềm năng', 5714074, '2025-12-29 18:30:00', 4),
  (N'Dương Bình', NULL, 'customer7@example.com', '0979618825', N'668 Đường B, Quận 5, TP.HCM', N'Event', 'active', N'Cold,Hot,VIP', NULL, '2026-01-03 16:45:00', 1),
  (N'Lê Văn Hà', N'Gamma Industries', 'customer8@example.com', '0980764163', N'612 Đường D, Quận Phú Nhuận, TP.HCM', N'Social Media', 'active', N'Cold,Khách hàng thân thiết', 1250255, '2026-01-24 10:00:00', 4),
  (N'Vũ Lan', N'Gamma Industries', 'customer9@example.com', '0992593189', N'115 Đường E, Quận Bình Thạnh, TP.HCM', N'Website', 'prospect', N'Warm,Hot,VIP', 8888702, '2025-12-28 14:15:00', 2),
  (N'Huỳnh Thảo', N'ABC Corp', 'customer10@example.com', '0978636831', N'327 Đường C, Quận Tân Bình, TP.HCM', N'Event', 'prospect', N'Cold,VIP,Khách hàng thân thiết', NULL, '2026-01-15 12:45:00', 1),
  (N'Vũ Trang', N'Beta Systems', 'customer11@example.com', '0915965464', N'772 Đường B, Quận 7, TP.HCM', N'Email Campaign', 'inactive', N'Khách hàng thân thiết,Warm,Tiềm năng', 9466215, '2025-12-31 09:00:00', 2),
  (N'Hoàng Tuấn', N'Gamma Industries', 'customer12@example.com', '0953384980', N'887 Đường A, Quận 1, TP.HCM', N'Website', 'prospect', N'VIP,Khách hàng thân thiết', NULL, '2025-12-02 08:00:00', 1),
  (N'Đặng An', NULL, 'customer13@example.com', '0913424449', NULL, N'Social Media', 'prospect', N'VIP,Hot,Warm', NULL, '2026-01-12 17:00:00', 2),
  (N'Đặng Huy', N'Beta Systems', 'customer14@example.com', '0961326288', NULL, N'Cold Call', 'active', N'Hot,Tiềm năng,VIP', NULL, '2025-12-11 08:45:00', 2),
  (N'Hoàng Thảo', N'Delta Solutions', 'customer15@example.com', '0988574375', N'230 Đường A, Quận Tân Bình, TP.HCM', N'Cold Call', 'prospect', N'Tiềm năng,Warm,Khách hàng thân thiết', 9332395, '2025-12-26 13:15:00', 2),
  (N'Lý Linh', N'Omega Co', 'customer16@example.com', '0959205811', N'743 Đường D, Quận 5, TP.HCM', N'Referral', 'prospect', N'Khách hàng thân thiết', NULL, '2025-12-14 13:15:00', 1),
  (N'Phan Linh', N'Gamma Industries', 'customer17@example.com', '0911322198', N'952 Đường E, Quận Bình Thạnh, TP.HCM', N'Social Media', 'prospect', N'Hot', 12578652, '2026-01-03 11:15:00', 4),
  (N'Nguyễn Văn Minh', N'Gamma Industries', 'customer18@example.com', '0937004062', N'639 Đường C, Quận Tân Bình, TP.HCM', N'Email Campaign', 'prospect', N'Hot', NULL, '2026-01-01 12:00:00', 2),
  (N'Hoàng Nam', N'Gamma Industries', 'customer19@example.com', '0978258117', N'822 Đường C, Quận 3, TP.HCM', N'Event', 'inactive', N'Khách hàng thân thiết,Hot,Tiềm năng', NULL, '2026-01-01 15:00:00', 3),
  (N'Ngô Phúc', N'Gamma Industries', 'customer20@example.com', '0995340714', N'511 Đường D, Quận Phú Nhuận, TP.HCM', N'Website', 'active', N'Khách hàng thân thiết,Tiềm năng,Warm', NULL, '2025-12-03 18:30:00', 1),
  (N'Lý Hà', NULL, 'customer21@example.com', '0946367750', N'697 Đường D, Quận 7, TP.HCM', N'Event', 'prospect', N'Hot,Khách hàng thân thiết', 10182613, '2026-01-27 16:00:00', 3),
  (N'Dương Linh', N'XYZ Ltd', 'customer22@example.com', '0998853459', N'137 Đường A, Quận 3, TP.HCM', N'Email Campaign', 'active', N'Tiềm năng', 14879827, '2026-01-01 10:00:00', 4),
  (N'Đỗ Hà', N'ABC Corp', 'customer23@example.com', '0918392692', NULL, N'Social Media', 'inactive', N'Warm,Cold,VIP', 3989229, '2025-12-27 10:15:00', 2),
  (N'Phan Dung', N'Delta Solutions', 'customer24@example.com', '0967600811', N'287 Đường C, Quận Tân Bình, TP.HCM', N'Cold Call', 'active', N'Hot,Khách hàng thân thiết', 7315660, '2026-01-24 17:45:00', 1),
  (N'Ngô Quân', N'Delta Solutions', 'customer25@example.com', '0994410246', N'318 Đường D, Quận Phú Nhuận, TP.HCM', N'Event', 'inactive', N'Tiềm năng,Cold,Hot', 10143809, '2026-01-19 14:15:00', 3),
  (N'Hồ Tuấn', N'VinaTech', 'customer26@example.com', '0963369875', N'381 Đường F, Quận Bình Thạnh, TP.HCM', N'Cold Call', 'active', N'VIP', 9166097, '2026-01-26 13:15:00', 1),
  (N'Trần Thị Thảo', N'ABC Corp', 'customer27@example.com', '0998059921', N'674 Đường A, Quận 3, TP.HCM', N'Social Media', 'prospect', N'Tiềm năng', 7691569, '2026-01-11 18:45:00', 3),
  (N'Bùi Quân', N'VinaTech', 'customer28@example.com', '0974924186', N'247 Đường B, Quận Tân Bình, TP.HCM', N'Cold Call', 'active', N'VIP,Hot,Khách hàng thân thiết', 12884724, '2025-12-25 14:30:00', 3),
  (N'Dương Hà', NULL, 'customer29@example.com', '0984953635', N'505 Đường E, Quận Tân Bình, TP.HCM', N'Event', 'prospect', N'Khách hàng thân thiết,Hot', 13891866, '2026-01-08 17:00:00', 1),
  (N'Đỗ Dung', N'Beta Systems', 'customer30@example.com', '0929598640', N'364 Đường C, Quận Bình Thạnh, TP.HCM', N'Cold Call', 'active', N'Hot', 2808993, '2026-01-07 13:15:00', 3),
  (N'Vũ An', NULL, 'customer31@example.com', '0974341515', N'559 Đường E, Quận 5, TP.HCM', N'Website', 'inactive', N'Warm,Khách hàng thân thiết', 1903736, '2025-12-31 11:00:00', 2),
  (N'Huỳnh Bình', NULL, 'customer32@example.com', '0915297121', N'384 Đường C, Quận Bình Thạnh, TP.HCM', N'Event', 'prospect', N'Cold,Hot', NULL, '2026-01-22 09:45:00', 1),
  (N'Ngô Hoa', N'VinaTech', 'customer33@example.com', '0935103660', N'227 Đường D, Quận 1, TP.HCM', N'Event', 'prospect', N'Hot,Khách hàng thân thiết', 13068913, '2026-01-17 09:45:00', 1),
  (N'Ngô Chi', N'ABC Corp', 'customer34@example.com', '0952010786', N'809 Đường A, Quận Tân Bình, TP.HCM', N'Email Campaign', 'inactive', N'Warm', 11146006, '2025-12-21 15:30:00', 3),
  (N'Đặng An', N'ABC Corp', 'customer35@example.com', '0969850196', N'873 Đường A, Quận 3, TP.HCM', N'Email Campaign', 'prospect', N'Warm', 5974591, '2025-12-05 15:45:00', 2),
  (N'Đặng An', N'VinaTech', 'customer36@example.com', '0994132068', NULL, N'Website', 'prospect', N'Khách hàng thân thiết,Warm', 2203868, '2025-12-27 10:00:00', 2),
  (N'Trần Thị Thảo', N'Gamma Industries', 'customer37@example.com', '0927958083', N'153 Đường E, Quận Tân Bình, TP.HCM', N'Email Campaign', 'prospect', N'Tiềm năng,Warm', 11858648, '2026-01-03 15:30:00', 3),
  (N'Hoàng Nam', N'Gamma Industries', 'customer38@example.com', '0963456288', N'365 Đường D, Quận 1, TP.HCM', N'Cold Call', 'active', N'VIP,Khách hàng thân thiết,Warm', 4548486, '2025-12-21 09:15:00', 4),
  (N'Lê Văn Hoa', NULL, 'customer39@example.com', '0923611016', NULL, N'Email Campaign', 'active', N'VIP,Khách hàng thân thiết', 2506059, '2025-12-09 13:00:00', 4),
  (N'Phan Tuấn', N'Gamma Industries', 'customer40@example.com', '0997903418', N'389 Đường C, Quận 5, TP.HCM', N'Cold Call', 'active', N'Tiềm năng', 8170922, '2026-01-09 16:45:00', 3),
  (N'Huỳnh Trang', N'VinaTech', 'customer41@example.com', '0994917405', N'394 Đường E, Quận 1, TP.HCM', N'Referral', 'inactive', N'Tiềm năng', NULL, '2026-01-04 15:45:00', 1),
  (N'Vũ Phúc', N'Delta Solutions', 'customer42@example.com', '0913669451', N'641 Đường B, Quận Phú Nhuận, TP.HCM', N'Referral', 'active', N'Tiềm năng,Cold', NULL, '2025-12-07 17:15:00', 4),
  (N'Trần Thị Dung', NULL, 'customer43@example.com', '0964549548', NULL, N'Social Media', 'active', N'Cold,Tiềm năng,Warm', 1234614, '2025-12-02 08:15:00', 4),
  (N'Đỗ Tuấn', N'Omega Co', 'customer44@example.com', '0928467169', N'660 Đường E, Quận 3, TP.HCM', N'Cold Call', 'prospect', N'VIP,Tiềm năng,Khách hàng thân thiết', 14410804, '2026-01-10 12:00:00', 1),
  (N'Bùi Hà', N'Omega Co', 'customer45@example.com', '0989972061', N'144 Đường A, Quận 7, TP.HCM', N'Email Campaign', 'active', N'Hot', NULL, '2025-12-31 09:45:00', 4),
  (N'Võ An', N'VinaTech', 'customer46@example.com', '0994560778', N'827 Đường D, Quận Tân Bình, TP.HCM', N'Email Campaign', 'active', N'Warm,VIP', 12981251, '2025-12-18 11:00:00', 2),
  (N'Phạm Thị Trang', NULL, 'customer47@example.com', '0965468013', N'206 Đường D, Quận 3, TP.HCM', N'Cold Call', 'prospect', N'Hot,Tiềm năng', NULL, '2026-01-20 11:15:00', 4),
  (N'Phạm Thị Chi', N'Alpha Group', 'customer48@example.com', '0988459493', N'752 Đường A, Quận 1, TP.HCM', N'Cold Call', 'inactive', N'VIP', 4902334, '2026-01-26 09:30:00', 4),
  (N'Vũ Hoa', NULL, 'customer49@example.com', '0924877806', N'823 Đường F, Quận Tân Bình, TP.HCM', N'Cold Call', 'prospect', N'Khách hàng thân thiết,Warm,Tiềm năng', NULL, '2025-12-31 17:30:00', 1),
  (N'Nguyễn Văn Thảo', NULL, 'customer50@example.com', '0951443369', N'838 Đường B, Quận Tân Bình, TP.HCM', N'Event', 'inactive', N'Hot', 13396897, '2026-01-05 11:45:00', 1);
GO

-- Deals (80 deals với đa dạng stages)
DELETE FROM dbo.deals;
DBCC CHECKIDENT ('deals', RESEED, 0);
GO

INSERT INTO dbo.deals (title, customer_id, value, stage, probability, expected_close_date, actual_close_date, description, owner_id, created_at) VALUES
  (N'Gói học nâng cao', 26, 0, N'Đăng ký', 20, '2026-01-18', NULL, N'Khách hàng quan tâm đến Gói học nâng cao', 3, '2025-12-30 12:30:00'),
  (N'Gói học nâng cao', 43, 4260000, N'Đăng ký', 20, '2026-02-21', NULL, N'Khách hàng quan tâm đến Gói học nâng cao', 3, '2026-01-12 14:15:00'),
  (N'Tư vấn chiến lược', 44, 0, N'Đăng ký', 20, '2026-02-13', NULL, N'Khách hàng quan tâm đến Tư vấn chiến lược', 3, '2025-12-25 17:30:00'),
  (N'Dịch vụ tối ưu', 15, 4260000, N'Đăng ký', 20, '2026-02-05', NULL, N'Khách hàng quan tâm đến Dịch vụ tối ưu', 2, '2025-12-02 11:45:00'),
  (N'Gói học nâng cao', 50, 4260000, N'Đăng ký', 20, '2026-01-26', NULL, N'Khách hàng quan tâm đến Gói học nâng cao', 2, '2025-12-24 13:00:00'),
  (N'Gói học cơ bản', 17, 4260000, N'Đăng ký', 20, '2026-02-26', NULL, N'Khách hàng quan tâm đến Gói học cơ bản', 2, '2026-01-10 17:00:00'),
  (N'Tư vấn chiến lược', 50, 4260000, N'Đăng ký', 20, '2026-02-13', NULL, N'Khách hàng quan tâm đến Tư vấn chiến lược', 3, '2025-12-30 17:45:00'),
  (N'Dịch vụ tối ưu', 46, 0, N'Đăng ký', 20, '2026-01-31', NULL, N'Khách hàng quan tâm đến Dịch vụ tối ưu', 2, '2026-01-06 13:15:00'),
  (N'Dịch vụ tối ưu', 32, 0, N'Đăng ký', 20, '2026-02-23', NULL, N'Khách hàng quan tâm đến Dịch vụ tối ưu', 3, '2026-01-06 13:00:00'),
  (N'Gói học cơ bản', 32, 0, N'Đăng ký', 20, '2026-01-05', NULL, N'Khách hàng quan tâm đến Gói học cơ bản', 3, '2025-12-01 09:00:00'),
  (N'Gói học thử', 41, 4260000, N'Đăng ký', 20, '2026-01-20', NULL, N'Khách hàng quan tâm đến Gói học thử', 3, '2025-12-27 10:45:00'),
  (N'Giải pháp tích hợp', 17, 4260000, N'Đăng ký', 20, '2026-02-12', NULL, N'Khách hàng quan tâm đến Giải pháp tích hợp', 3, '2026-01-17 12:30:00'),
  (N'Gói combo', 19, 0, N'Đăng ký', 20, '2026-02-26', NULL, N'Khách hàng quan tâm đến Gói combo', 2, '2026-01-15 14:30:00'),
  (N'Dịch vụ tối ưu', 7, 0, N'Đăng ký', 20, '2026-01-13', NULL, N'Khách hàng quan tâm đến Dịch vụ tối ưu', 2, '2025-12-03 17:00:00'),
  (N'Hỗ trợ kỹ thuật', 7, 0, N'Đăng ký', 20, '2026-02-15', NULL, N'Khách hàng quan tâm đến Hỗ trợ kỹ thuật', 3, '2025-12-06 13:45:00'),
  (N'Gói combo', 18, 0, N'Đăng ký', 20, '2026-01-06', NULL, N'Khách hàng quan tâm đến Gói combo', 2, '2025-12-21 15:15:00'),
  (N'Gói combo', 29, 4260000, N'Đăng ký', 20, '2026-02-12', NULL, N'Khách hàng quan tâm đến Gói combo', 3, '2025-12-07 08:15:00'),
  (N'Giải pháp tích hợp', 27, 0, N'Đăng ký', 20, '2025-12-21', NULL, N'Khách hàng quan tâm đến Giải pháp tích hợp', 2, '2025-12-12 17:45:00'),
  (N'Gói combo', 50, 4260000, N'Đăng ký', 20, '2026-01-14', NULL, N'Khách hàng quan tâm đến Gói combo', 2, '2025-12-16 16:00:00'),
  (N'Gói học cơ bản', 26, 0, N'Đăng ký', 20, '2026-01-21', NULL, N'Khách hàng quan tâm đến Gói học cơ bản', 2, '2026-01-13 16:30:00'),
  (N'Gói học thử', 26, 11677139, N'prospect', 30, '2026-01-12', NULL, N'Khách hàng quan tâm đến Gói học thử', 2, '2025-12-28 13:00:00'),
  (N'Gói combo', 32, 12858231, N'prospect', 30, '2026-01-17', NULL, N'Khách hàng quan tâm đến Gói combo', 3, '2026-01-10 08:00:00'),
  (N'Gói học thử', 21, 10000540, N'prospect', 30, '2025-12-27', NULL, N'Khách hàng quan tâm đến Gói học thử', 2, '2025-12-05 13:15:00'),
  (N'Gói học thử', 18, 8390298, N'prospect', 30, '2026-01-09', NULL, N'Khách hàng quan tâm đến Gói học thử', 3, '2025-12-06 10:45:00'),
  (N'Gói học nâng cao', 44, 11460256, N'prospect', 30, '2026-02-12', NULL, N'Khách hàng quan tâm đến Gói học nâng cao', 3, '2026-01-17 18:30:00'),
  (N'Gói học cơ bản', 16, 8834754, N'prospect', 30, '2026-02-04', NULL, N'Khách hàng quan tâm đến Gói học cơ bản', 3, '2025-12-24 16:45:00'),
  (N'Gói học nâng cao', 19, 7611490, N'prospect', 30, '2026-02-11', NULL, N'Khách hàng quan tâm đến Gói học nâng cao', 2, '2026-01-11 18:30:00'),
  (N'Gói học cơ bản', 2, 13082089, N'prospect', 30, '2026-02-11', NULL, N'Khách hàng quan tâm đến Gói học cơ bản', 2, '2025-12-03 17:45:00'),
  (N'Hỗ trợ kỹ thuật', 22, 6389355, N'prospect', 30, '2026-01-26', NULL, N'Khách hàng quan tâm đến Hỗ trợ kỹ thuật', 3, '2026-01-06 09:30:00'),
  (N'Dịch vụ tối ưu', 46, 13899177, N'prospect', 30, '2026-01-14', NULL, N'Khách hàng quan tâm đến Dịch vụ tối ưu', 3, '2025-12-05 09:00:00'),
  (N'Hỗ trợ kỹ thuật', 20, 7484615, N'prospect', 30, '2026-01-24', NULL, N'Khách hàng quan tâm đến Hỗ trợ kỹ thuật', 3, '2026-01-16 11:00:00'),
  (N'Gói học VIP', 7, 5430161, N'prospect', 30, '2026-02-25', NULL, N'Khách hàng quan tâm đến Gói học VIP', 3, '2025-12-27 09:00:00'),
  (N'Gói học cơ bản', 36, 7668806, N'prospect', 30, '2026-02-17', NULL, N'Khách hàng quan tâm đến Gói học cơ bản', 2, '2026-01-08 14:15:00'),
  (N'Hỗ trợ kỹ thuật', 4, 13544559, N'prospect', 30, '2026-02-18', NULL, N'Khách hàng quan tâm đến Hỗ trợ kỹ thuật', 2, '2026-01-08 10:00:00'),
  (N'Giải pháp tích hợp', 15, 8226536, N'prospect', 30, '2026-02-19', NULL, N'Khách hàng quan tâm đến Giải pháp tích hợp', 2, '2025-12-31 16:45:00'),
  (N'Dịch vụ tối ưu', 46, 8170621, N'demo', 50, '2026-01-18', NULL, N'Khách hàng quan tâm đến Dịch vụ tối ưu', 3, '2025-12-13 11:30:00'),
  (N'Gói học thử', 39, 5618570, N'demo', 50, '2026-01-31', NULL, N'Khách hàng quan tâm đến Gói học thử', 2, '2026-01-15 17:00:00'),
  (N'Dịch vụ tối ưu', 9, 5778206, N'demo', 50, '2026-02-10', NULL, N'Khách hàng quan tâm đến Dịch vụ tối ưu', 2, '2026-01-03 17:45:00'),
  (N'Gói học VIP', 40, 3785934, N'demo', 50, '2026-01-11', NULL, N'Khách hàng quan tâm đến Gói học VIP', 3, '2025-12-03 14:15:00'),
  (N'Gói học VIP', 5, 12748800, N'demo', 50, '2026-02-08', NULL, N'Khách hàng quan tâm đến Gói học VIP', 3, '2025-12-31 14:00:00'),
  (N'Gói học VIP', 45, 7504140, N'demo', 50, '2026-02-14', NULL, N'Khách hàng quan tâm đến Gói học VIP', 3, '2026-01-07 16:30:00'),
  (N'Dịch vụ tối ưu', 40, 7059228, N'demo', 50, '2026-02-14', NULL, N'Khách hàng quan tâm đến Dịch vụ tối ưu', 3, '2025-12-26 18:45:00'),
  (N'Gói học thử', 38, 9319813, N'demo', 50, '2026-01-16', NULL, N'Khách hàng quan tâm đến Gói học thử', 2, '2025-12-15 15:15:00'),
  (N'Gói học VIP', 36, 3867782, N'demo', 50, '2026-01-31', NULL, N'Khách hàng quan tâm đến Gói học VIP', 3, '2026-01-12 10:30:00'),
  (N'Gói học nâng cao', 44, 10174911, N'demo', 50, '2025-12-11', NULL, N'Khách hàng quan tâm đến Gói học nâng cao', 2, '2025-12-01 14:45:00'),
  (N'Gói học thử', 29, 13518726, N'demo', 50, '2026-02-09', NULL, N'Khách hàng quan tâm đến Gói học thử', 3, '2026-01-09 18:15:00'),
  (N'Gói học cơ bản', 36, 10410388, N'demo', 50, '2025-12-31', NULL, N'Khách hàng quan tâm đến Gói học cơ bản', 3, '2025-12-01 14:15:00'),
  (N'Gói học cơ bản', 47, 4594559, N'proposal', 60, '2026-01-27', NULL, N'Khách hàng quan tâm đến Gói học cơ bản', 3, '2025-12-09 08:30:00'),
  (N'Dịch vụ tối ưu', 4, 8829050, N'proposal', 60, '2026-02-20', NULL, N'Khách hàng quan tâm đến Dịch vụ tối ưu', 2, '2025-12-21 18:45:00'),
  (N'Gói học VIP', 45, 10948301, N'proposal', 60, '2026-02-21', NULL, N'Khách hàng quan tâm đến Gói học VIP', 3, '2025-12-17 11:30:00'),
  (N'Hỗ trợ kỹ thuật', 31, 7931807, N'proposal', 60, '2026-02-23', NULL, N'Khách hàng quan tâm đến Hỗ trợ kỹ thuật', 2, '2026-01-17 17:00:00'),
  (N'Gói combo', 36, 9066324, N'proposal', 60, '2026-02-17', NULL, N'Khách hàng quan tâm đến Gói combo', 2, '2026-01-13 17:00:00'),
  (N'Giải pháp tích hợp', 7, 5533264, N'proposal', 60, '2026-01-04', NULL, N'Khách hàng quan tâm đến Giải pháp tích hợp', 3, '2025-12-15 12:00:00'),
  (N'Tư vấn chiến lược', 44, 14501419, N'proposal', 60, '2026-02-09', NULL, N'Khách hàng quan tâm đến Tư vấn chiến lược', 3, '2026-01-08 15:15:00'),
  (N'Gói học nâng cao', 21, 12683715, N'proposal', 60, '2026-02-21', NULL, N'Khách hàng quan tâm đến Gói học nâng cao', 2, '2026-01-10 17:15:00'),
  (N'Gói combo', 35, 11106436, N'proposal', 60, '2026-01-08', NULL, N'Khách hàng quan tâm đến Gói combo', 3, '2025-12-29 17:00:00'),
  (N'Giải pháp tích hợp', 39, 3446137, N'proposal', 60, '2026-01-25', NULL, N'Khách hàng quan tâm đến Giải pháp tích hợp', 3, '2026-01-04 16:45:00'),
  (N'Giải pháp tích hợp', 26, 14006563, N'negotiation', 75, '2026-02-21', NULL, N'Khách hàng quan tâm đến Giải pháp tích hợp', 3, '2026-01-20 18:45:00'),
  (N'Gói học nâng cao', 21, 10029826, N'negotiation', 75, '2026-02-07', NULL, N'Khách hàng quan tâm đến Gói học nâng cao', 2, '2025-12-12 18:00:00'),
  (N'Dịch vụ tối ưu', 19, 14383142, N'negotiation', 75, '2026-02-16', NULL, N'Khách hàng quan tâm đến Dịch vụ tối ưu', 2, '2026-01-06 18:30:00'),
  (N'Gói combo', 4, 5465508, N'negotiation', 75, '2026-02-17', NULL, N'Khách hàng quan tâm đến Gói combo', 2, '2025-12-27 10:00:00'),
  (N'Giải pháp tích hợp', 1, 12973071, N'negotiation', 75, '2026-02-09', NULL, N'Khách hàng quan tâm đến Giải pháp tích hợp', 2, '2025-12-19 16:00:00'),
  (N'Giải pháp tích hợp', 46, 12349004, N'negotiation', 75, '2026-02-23', NULL, N'Khách hàng quan tâm đến Giải pháp tích hợp', 2, '2025-12-22 13:45:00'),
  (N'Gói học cơ bản', 32, 8182123, N'negotiation', 75, '2026-01-15', NULL, N'Khách hàng quan tâm đến Gói học cơ bản', 3, '2025-12-16 15:15:00'),
  (N'Gói học VIP', 16, 12857632, N'negotiation', 75, '2026-02-24', NULL, N'Khách hàng quan tâm đến Gói học VIP', 3, '2025-12-04 17:15:00'),
  (N'Gói học cơ bản', 23, 12147354, N'won', 100, '2026-01-25', '2026-01-23', N'Khách hàng quan tâm đến Gói học cơ bản', 2, '2026-01-09 16:45:00'),
  (N'Gói học nâng cao', 25, 9164629, N'won', 100, '2026-01-17', '2026-01-22', N'Khách hàng quan tâm đến Gói học nâng cao', 3, '2026-01-03 17:45:00'),
  (N'Gói học nâng cao', 43, 15354302, N'won', 100, '2026-02-18', '2026-01-07', N'Khách hàng quan tâm đến Gói học nâng cao', 2, '2025-12-20 09:15:00'),
  (N'Hỗ trợ kỹ thuật', 19, 6836627, N'won', 100, '2026-02-26', '2026-01-23', N'Khách hàng quan tâm đến Hỗ trợ kỹ thuật', 3, '2026-01-10 15:30:00'),
  (N'Tư vấn chiến lược', 40, 7751212, N'won', 100, '2026-01-31', '2026-01-19', N'Khách hàng quan tâm đến Tư vấn chiến lược', 3, '2025-12-30 08:15:00'),
  (N'Gói học nâng cao', 14, 10251245, N'won', 100, '2026-01-26', '2026-01-21', N'Khách hàng quan tâm đến Gói học nâng cao', 2, '2026-01-02 09:30:00'),
  (N'Gói học VIP', 15, 15814137, N'won', 100, '2026-02-15', '2026-01-16', N'Khách hàng quan tâm đến Gói học VIP', 3, '2025-12-04 09:15:00'),
  (N'Gói học nâng cao', 10, 16748002, N'won', 100, '2026-02-22', '2026-01-26', N'Khách hàng quan tâm đến Gói học nâng cao', 3, '2026-01-04 13:45:00'),
  (N'Dịch vụ tối ưu', 15, 5085263, N'won', 100, '2026-02-03', '2026-01-07', N'Khách hàng quan tâm đến Dịch vụ tối ưu', 3, '2025-12-13 16:15:00'),
  (N'Tư vấn chiến lược', 35, 14750829, N'won', 100, '2025-12-24', '2026-01-13', N'Khách hàng quan tâm đến Tư vấn chiến lược', 2, '2025-12-05 16:15:00'),
  (N'Gói học VIP', 45, 3484669, N'lost', 0, '2026-01-02', '2026-01-06', N'Khách hàng quan tâm đến Gói học VIP', 2, '2025-12-09 15:00:00'),
  (N'Gói học VIP', 27, 5993352, N'lost', 0, '2026-01-31', '2026-01-22', N'Khách hàng quan tâm đến Gói học VIP', 3, '2025-12-29 13:30:00'),
  (N'Gói học cơ bản', 33, 9697520, N'lost', 0, '2026-02-23', '2026-01-22', N'Khách hàng quan tâm đến Gói học cơ bản', 3, '2026-01-07 17:00:00'),
  (N'Gói combo', 20, 6135578, N'lost', 0, '2026-02-06', '2026-01-17', N'Khách hàng quan tâm đến Gói combo', 2, '2025-12-28 12:00:00'),
  (N'Hỗ trợ kỹ thuật', 37, 4674613, N'lost', 0, '2026-01-23', '2026-01-15', N'Khách hàng quan tâm đến Hỗ trợ kỹ thuật', 3, '2026-01-09 15:45:00');
GO

-- Activities (30 recent activities)
DELETE FROM dbo.activities;
DBCC CHECKIDENT ('activities', RESEED, 0);
GO

INSERT INTO dbo.activities (type, description, customer_id, deal_id, user_id, activity_date, created_at) VALUES
  (N'Follow-up', N'Theo dõi tiến độ đơn hàng', 14, 68, 4, '2025-12-04 16:00:00', '2025-12-04 16:00:00'),
  (N'Call', N'Follow-up khách hàng', 30, 72, 2, '2026-01-06 14:45:00', '2026-01-06 14:45:00'),
  (N'Email', N'Gửi báo giá chi tiết', 43, 80, 3, '2025-12-26 15:30:00', '2025-12-26 15:30:00'),
  (N'Email', N'Email cảm ơn sau cuộc họp', 26, NULL, 4, '2026-01-24 10:00:00', '2026-01-24 10:00:00'),
  (N'Demo', N'Demo tính năng A', 43, 44, 2, '2025-12-01 14:45:00', '2025-12-01 14:45:00'),
  (N'Follow-up', N'Nhắc lịch meeting', 44, 19, 2, '2026-01-24 13:00:00', '2026-01-24 13:00:00'),
  (N'Meeting', N'Thuyết trình giải pháp', 38, NULL, 2, '2025-12-15 15:30:00', '2025-12-15 15:30:00'),
  (N'Call', N'Gọi điện trao đổi nhu cầu', 10, 49, 4, '2025-12-07 13:30:00', '2025-12-07 13:30:00'),
  (N'Call', N'Tư vấn giải pháp qua điện thoại', 40, 71, 2, '2025-12-14 16:45:00', '2025-12-14 16:45:00'),
  (N'Meeting', N'Thuyết trình giải pháp', 8, NULL, 2, '2026-01-06 15:15:00', '2026-01-06 15:15:00'),
  (N'Meeting', N'Thuyết trình giải pháp', 22, 40, 4, '2026-01-13 16:00:00', '2026-01-13 16:00:00'),
  (N'Follow-up', N'Theo dõi tiến độ đơn hàng', 26, 75, 3, '2026-01-11 09:15:00', '2026-01-11 09:15:00'),
  (N'Demo', N'Workshop hướng dẫn', 34, 65, 4, '2026-01-17 13:00:00', '2026-01-17 13:00:00'),
  (N'Email', N'Email cảm ơn sau cuộc họp', 40, 66, 2, '2025-12-05 09:00:00', '2025-12-05 09:00:00'),
  (N'Demo', N'Demo tính năng A', 14, 40, 2, '2025-12-10 17:15:00', '2025-12-10 17:15:00'),
  (N'Demo', N'Demo tính năng A', 7, 19, 4, '2026-01-26 18:15:00', '2026-01-26 18:15:00'),
  (N'Meeting', N'Demo sản phẩm online', 11, 77, 2, '2025-12-16 15:45:00', '2025-12-16 15:45:00'),
  (N'Email', N'Gửi báo giá chi tiết', 39, 50, 2, '2025-12-23 13:00:00', '2025-12-23 13:00:00'),
  (N'Demo', N'Trải nghiệm sản phẩm thực tế', 44, 13, 4, '2026-01-21 17:45:00', '2026-01-21 17:45:00'),
  (N'Call', N'Gọi điện trao đổi nhu cầu', 49, 25, 2, '2025-12-08 10:45:00', '2025-12-08 10:45:00'),
  (N'Call', N'Gọi điện trao đổi nhu cầu', 9, 29, 2, '2026-01-25 16:15:00', '2026-01-25 16:15:00'),
  (N'Meeting', N'Thuyết trình giải pháp', 18, NULL, 3, '2026-01-05 18:45:00', '2026-01-05 18:45:00'),
  (N'Demo', N'Workshop hướng dẫn', 47, 67, 3, '2025-12-28 12:15:00', '2025-12-28 12:15:00'),
  (N'Follow-up', N'Chăm sóc khách hàng sau bán', 29, 53, 2, '2025-12-17 08:00:00', '2025-12-17 08:00:00'),
  (N'Call', N'Tư vấn giải pháp qua điện thoại', 50, NULL, 3, '2026-01-18 16:45:00', '2026-01-18 16:45:00'),
  (N'Call', N'Tư vấn giải pháp qua điện thoại', 27, 30, 2, '2026-01-22 13:30:00', '2026-01-22 13:30:00'),
  (N'Follow-up', N'Chăm sóc khách hàng sau bán', 23, NULL, 2, '2025-12-11 10:00:00', '2025-12-11 10:00:00'),
  (N'Follow-up', N'Chăm sóc khách hàng sau bán', 49, 6, 3, '2026-01-21 16:15:00', '2026-01-21 16:15:00'),
  (N'Email', N'Email cảm ơn sau cuộc họp', 25, NULL, 2, '2025-12-13 09:30:00', '2025-12-13 09:30:00'),
  (N'Follow-up', N'Chăm sóc khách hàng sau bán', 29, 1, 2, '2026-01-15 16:15:00', '2026-01-15 16:15:00');
GO

-- Reminders (10 upcoming)
DELETE FROM dbo.reminders;
DBCC CHECKIDENT ('reminders', RESEED, 0);
GO

INSERT INTO dbo.reminders (title, description, reminder_date, deal_id, customer_id, user_id, status) VALUES
  (N'Chuẩn bị demo', N'Chi tiết: Chuẩn bị demo - deadline quan trọng', '2026-01-27 09:30:00', NULL, 10, 2, 'pending'),
  (N'Chăm sóc khách hàng', N'Chi tiết: Chăm sóc khách hàng - deadline quan trọng', '2026-02-04 15:15:00', NULL, 26, 2, 'pending'),
  (N'Thanh toán đợt 1', N'Chi tiết: Thanh toán đợt 1 - deadline quan trọng', '2026-02-10 11:00:00', NULL, 49, 2, 'pending'),
  (N'Chuẩn bị demo', N'Chi tiết: Chuẩn bị demo - deadline quan trọng', '2026-02-04 09:30:00', NULL, 19, 2, 'pending'),
  (N'Meeting tuần', N'Chi tiết: Meeting tuần - deadline quan trọng', '2026-02-21 14:45:00', NULL, 11, 3, 'pending'),
  (N'Training nhóm', N'Chi tiết: Training nhóm - deadline quan trọng', '2026-02-26 10:30:00', 64, 34, 2, 'pending'),
  (N'Chăm sóc khách hàng', N'Chi tiết: Chăm sóc khách hàng - deadline quan trọng', '2026-02-05 11:30:00', NULL, 15, 2, 'completed'),
  (N'Follow-up với khách hàng', N'Chi tiết: Follow-up với khách hàng - deadline quan trọng', '2026-02-20 09:45:00', 40, NULL, 2, 'pending'),
  (N'Training nhóm', N'Chi tiết: Training nhóm - deadline quan trọng', '2026-02-26 12:00:00', NULL, 16, 2, 'pending'),
  (N'Gọi điện nhắc nhở', N'Chi tiết: Gọi điện nhắc nhở - deadline quan trọng', '2026-02-12 14:45:00', NULL, 44, 3, 'pending');
GO

-- Data generation completed!
