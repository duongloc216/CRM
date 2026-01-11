-- 1. Chuyển sang database CRM
IF DB_ID('CustomerManagement') IS NULL
    CREATE DATABASE CustomerManagement
    COLLATE Vietnamese_CI_AS;
GO

USE CustomerManagement;
GO

-- 2. Bảng users
IF OBJECT_ID('dbo.users','U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255)     NOT NULL,
        email NVARCHAR(255)    NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        role NVARCHAR(50)      NOT NULL 
             CHECK (role IN ('admin','sales','marketing')),
        status NVARCHAR(20)    NOT NULL 
             CONSTRAINT df_users_status DEFAULT 'active',
        created_at DATETIME2   NOT NULL 
             CONSTRAINT df_users_created_at DEFAULT GETDATE(),
        updated_at DATETIME2   NOT NULL 
             CONSTRAINT df_users_updated_at DEFAULT GETDATE(),
        last_login DATETIME2   NULL
    );
END
GO

-- Trigger tự động cập nhật updated_at
CREATE OR ALTER TRIGGER trg_users_updated_at
ON dbo.users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE u
    SET u.updated_at = GETDATE()
    FROM dbo.users u
    JOIN inserted i ON u.id = i.id;
END
GO

-- 3. Bảng customers
IF OBJECT_ID('dbo.customers','U') IS NULL
BEGIN
    CREATE TABLE dbo.customers (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255)    NOT NULL,
        company NVARCHAR(255) NULL,
        email NVARCHAR(255)   NULL,
        phone NVARCHAR(50)    NULL,
        address NVARCHAR(MAX) NULL,
        source NVARCHAR(100)  NULL,
        status NVARCHAR(50)   NOT NULL 
             CONSTRAINT df_customers_status DEFAULT 'prospect',
        tags NVARCHAR(255)    NULL,
        total_value DECIMAL(15,2) NULL,
        last_contact DATETIME,
        created_by INT        NULL 
             CONSTRAINT fk_customers_users FOREIGN KEY REFERENCES dbo.users(id),
        created_at DATETIME2  NOT NULL 
             CONSTRAINT df_customers_created_at DEFAULT GETDATE(),
        updated_at DATETIME2  NOT NULL 
             CONSTRAINT df_customers_updated_at DEFAULT GETDATE()
    );
END
GO

CREATE OR ALTER TRIGGER trg_customers_updated_at
ON dbo.customers
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE c
    SET c.updated_at = GETDATE()
    FROM dbo.customers c
    JOIN inserted i ON c.id = i.id;
END
GO

-- 4. Bảng deals
IF OBJECT_ID('dbo.deals','U') IS NULL
BEGIN
    CREATE TABLE dbo.deals (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255)      NOT NULL,
        customer_id INT          NULL 
             CONSTRAINT fk_deals_customers FOREIGN KEY REFERENCES dbo.customers(id),
        value DECIMAL(15,2)      NULL,
        stage NVARCHAR(50)       NOT NULL 
             CONSTRAINT df_deals_stage DEFAULT 'prospect',
        probability INT          NOT NULL 
             CONSTRAINT df_deals_probability DEFAULT 0
             CHECK (probability BETWEEN 0 AND 100),
        expected_close_date DATE NULL,
        actual_close_date DATE   NULL,
        description NVARCHAR(MAX) NULL,
        owner_id INT             NULL 
             CONSTRAINT fk_deals_users FOREIGN KEY REFERENCES dbo.users(id),
        created_at DATETIME2     NOT NULL 
             CONSTRAINT df_deals_created_at DEFAULT GETDATE(),
        updated_at DATETIME2     NOT NULL 
             CONSTRAINT df_deals_updated_at DEFAULT GETDATE()
    );
END
GO

CREATE OR ALTER TRIGGER trg_deals_updated_at
ON dbo.deals
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE d
    SET d.updated_at = GETDATE()
    FROM dbo.deals d
    JOIN inserted i ON d.id = i.id;
END
GO

-- 5. Bảng activities
IF OBJECT_ID('dbo.activities','U') IS NULL
BEGIN
    CREATE TABLE dbo.activities (
        id INT IDENTITY(1,1) PRIMARY KEY,
        type NVARCHAR(100)       NOT NULL,
        description NVARCHAR(MAX) NULL,
        customer_id INT          NULL 
             CONSTRAINT fk_activities_customers FOREIGN KEY REFERENCES dbo.customers(id),
        deal_id INT              NULL 
             CONSTRAINT fk_activities_deals FOREIGN KEY REFERENCES dbo.deals(id),
        user_id INT              NULL 
             CONSTRAINT fk_activities_users FOREIGN KEY REFERENCES dbo.users(id),
        activity_date DATETIME2  NOT NULL 
             CONSTRAINT df_activities_date DEFAULT GETDATE(),
        created_at DATETIME2     NOT NULL 
             CONSTRAINT df_activities_created_at DEFAULT GETDATE()
    );
END
GO

-- 6. Bảng reminders
IF OBJECT_ID('dbo.reminders','U') IS NULL
BEGIN
    CREATE TABLE dbo.reminders (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255)       NOT NULL,
        description NVARCHAR(MAX) NULL,
        reminder_date DATETIME2   NOT NULL,
        deal_id INT               NULL 
             CONSTRAINT fk_reminders_deals FOREIGN KEY REFERENCES dbo.deals(id),
        customer_id INT           NULL 
             CONSTRAINT fk_reminders_customers FOREIGN KEY REFERENCES dbo.customers(id),
        user_id INT               NULL 
             CONSTRAINT fk_reminders_users FOREIGN KEY REFERENCES dbo.users(id),
        status NVARCHAR(20)       NOT NULL 
             CONSTRAINT df_reminders_status DEFAULT 'pending'
             CHECK (status IN ('pending','completed','cancelled')),
        created_at DATETIME2      NOT NULL 
             CONSTRAINT df_reminders_created_at DEFAULT GETDATE()
    );
END
GO










USE CustomerManagement;
GO

-- 1. Dữ liệu mẫu cho bảng users
INSERT INTO dbo.users (name, email, password_hash, role)
VALUES
    (N'Nguyễn Văn A',     'nva@example.com',     'hash_pwd_1', 'admin'),
    (N'Trần Thị B',       'ttb@example.com',     'hash_pwd_2', 'sales'),
    (N'Lê Văn C',         'lvc@example.com',     'hash_pwd_3', 'marketing');
GO

-- 2. Dữ liệu mẫu cho bảng customers
INSERT INTO dbo.customers
    (name, company, email, phone, address, source, status, tags, total_value, last_contact, created_by)
VALUES
  (N'Lê Văn Huy', N'ABC Corp', N'customer1@example.com', N'0973452693', N'456 Đường B, Quận 3, TP.HCM', N'Social Media', N'active', N'Hot', 9302159.86, '2025-06-12 16:30:00', 3),
  (N'Đặng Lan', N'ABC Corp', N'customer2@example.com', N'0919406979', N'789 Đường C, Quận 5, TP.HCM', N'Social Media', N'active', N'Tiềm năng,Hot', 872824.64, '2025-06-02 11:00:00', 1),
  (N'Lê Văn Thảo', NULL, N'customer3@example.com', N'0901040099', N'505 Đường H, Quận Tân Phú, TP.HCM', N'Social Media', N'prospect', N'VIP,Khách hàng thân thiết', NULL, '2025-06-14 13:00:00', 3),
  (N'Vũ Lan', NULL, N'customer4@example.com', N'0916394650', N'456 Đường B, Quận 3, TP.HCM', N'Cold Call', N'active     ', N'VIP,Tiềm năng', 9359690.92, '2025-06-02 17:30:00', 2),
  (N'Phạm Thị Phúc', N'XYZ Ltd', N'customer5@example.com', N'0907544826', N'404 Đường G, Quận Tân Bình, TP.HCM', N'Referral', N'prospect', N'Khách hàng thân thiết', 9944607.16, '2025-06-06 13:00:00', 3),
  (N'Võ Hoa', N'Delta Solutions', N'customer6@example.com', N'0919543384', NULL, N'Referral', N'prospect', N'Hot,Warm', 1833681.08, '2025-06-14 13:30:00', 3),
  (N'Phạm Thị Anh', N'XYZ Ltd', N'customer7@example.com', N'0902982295', N'505 Đường H, Quận Tân Phú, TP.HCM', N'Event', N'active', N'Tiềm năng', NULL, '2025-06-18 11:30:00', 2),
  (N'Vũ Thảo', N'VinaTech', N'customer8@example.com', N'0916401469', N'101 Đường D, Quận Phú Nhuận, TP.HCM', N'Referral', N'prospect', N'Warm', 7446417.21, '2025-06-12 13:30:00', 2),
  (N'Bùi Trang', N'Omega Co', N'customer9@example.com', N'0903162145', N'456 Đường B, Quận 3, TP.HCM', N'Website', N'prospect', N'Tiềm năng,Khách hàng thân thiết', 4261917.59, '2025-06-22 09:30:00', 2),
  (N'Phan Phúc', N'XYZ Ltd', N'customer10@example.com', N'0903280803', N'789 Đường C, Quận 5, TP.HCM', N'Cold Call', N'active', N'Tiềm năng', 5947532.14, '2025-06-17 13:30:00', 1),
  (N'Đặng Minh', N'XYZ Ltd', N'customer11@example.com', N'0989784591', N'456 Đường B, Quận 3, TP.HCM', N'Event', N'prospect', N'Cold', 4471847.85, '2025-06-05 14:00:00', 3),
  (N'Bùi Trang', N'Omega Co', N'customer12@example.com', N'0916562168', NULL, N'Website', N'active', N'Cũ,Warm', 9553743.88, '2025-06-14 14:30:00', 1),
  (N'Vũ Hương', N'Omega Co', N'customer13@example.com', N'0975906642', N'202 Đường E, Quận Bình Thạnh, TP.HCM', N'Social Media', N'active', N'Tiềm năng', NULL, '2025-06-14 09:30:00', 2),
  (N'Đặng Hoa', N'XYZ Ltd', N'customer14@example.com', N'0976717999', NULL, N'Referral', N'active', N'Warm,VIP', 7241412.56, '2025-06-09 09:00:00', 1),
  (N'Huỳnh Hương', N'XYZ Ltd', N'customer15@example.com', N'0905116506', N'123 Đường A, Quận 1, TP.HCM', N'Referral', N'active', N'VIP,Warm', 4577539.77, '2025-06-14 12:00:00', 3),
  (N'Vũ Phúc', N'Delta Solutions', N'customer16@example.com', N'0919633077', N'303 Đường F, Quận Gò Vấp, TP.HCM', N'Social Media', N'inactive', N'Cũ', 3073845.37, '2025-06-08 15:30:00', 2),
  (N'Võ Anh', N'Delta Solutions', N'customer17@example.com', N'0915399483', N'505 Đường H, Quận Tân Phú, TP.HCM', N'Website', N'prospect', N'Tiềm năng', 7767441.74, '2025-06-16 16:00:00', 3),
  (N'Huỳnh Trang', NULL, N'customer18@example.com', N'0986808639', NULL, N'Referral', N'active', N'Cũ,Warm', NULL, '2025-06-14 08:00:00', 2),
  (N'Đặng Thảo', N'Delta Solutions', N'customer19@example.com', N'0917845367', N'202 Đường E, Quận Bình Thạnh, TP.HCM', N'Website', N'active', N'Hot', 1515361.38, '2025-06-04 09:00:00', 3),
  (N'Vũ Anh', N'XYZ Ltd', N'customer20@example.com', N'0985250036', NULL, N'Cold Call', N'active', N'Khách hàng thân thiết', 4184507.25, '2025-06-11 11:00:00', 3),
  (N'Võ Minh', N'Omega Co', N'customer21@example.com', N'0912932482', N'505 Đường H, Quận Tân Phú, TP.HCM', N'Social Media', N'inactive', N'VIP', NULL, '2025-06-21 13:30:00', 2),
  (N'Nguyễn Văn Tuấn', N'ABC Corp', N'customer22@example.com', N'0979080352', N'505 Đường H, Quận Tân Phú, TP.HCM', N'Social Media', N'prospect', N'Warm,VIP', 6258195.03, '2025-06-04 08:00:00', 1),
  (N'Võ Huy', N'XYZ Ltd', N'customer23@example.com', N'0909277271', N'606 Đường I, TP. Thủ Đức, TP.HCM', N'Cold Call', N'prospect', N'Khách hàng thân thiết,Cold', NULL, '2025-06-17 15:00:00', 3),
  (N'Bùi Anh', N'Delta Solutions', N'customer24@example.com', N'0982628045', N'789 Đường C, Quận 5, TP.HCM', N'Referral', N'prospect', N'Khách hàng thân thiết', 341630.45, '2025-06-16 09:00:00', 3),
  (N'Đặng Tuấn', NULL, N'customer25@example.com', N'0919583063', NULL, N'Social Media', N'prospect', N'Cold,Tiềm năng', NULL, '2025-06-12 08:00:00', 3),
  (N'Bùi Minh', N'ABC Corp', N'customer26@example.com', N'0919161847', N'606 Đường I, TP. Thủ Đức, TP.HCM', N'Website', N'inactive', N'Khách hàng thân thiết,Cũ', NULL, '2025-06-04 15:00:00', 2),
  (N'Nguyễn Văn Thảo', N'Omega Co', N'customer27@example.com', N'0911616693', N'505 Đường H, Quận Tân Phú, TP.HCM', N'Referral', N'prospect', N'Warm', 7496321.81, '2025-06-16 10:00:00', 3),
  (N'Võ Trang', N'Delta Solutions', N'customer28@example.com', N'0983633193', N'456 Đường B, Quận 3, TP.HCM', N'Cold Call', N'inactive', N'Cũ,Cold', 2245366.16, '2025-06-10 14:00:00', 2),
  (N'Nguyễn Văn Lan', N'XYZ Ltd', N'customer29@example.com', N'0919917316', N'789 Đường C, Quận 5, TP.HCM', N'Social Media', N'active', N'Cold', 9203620.31, '2025-06-16 12:30:00', 1),
  (N'Đặng Trang', NULL, N'customer30@example.com', N'0982814544', N'123 Đường A, Quận 1, TP.HCM', N'Event', N'prospect', N'Tiềm năng,Cũ', 7749820.46, '2025-06-12 11:00:00', 3),
  (N'Vũ Phúc', NULL, N'customer31@example.com', N'0986726002', N'101 Đường D, Quận Phú Nhuận, TP.HCM', N'Cold Call', N'active', N'Khách hàng thân thiết', 9179024.94, '2025-06-22 13:00:00', 3),
  (N'Phạm Thị Anh', NULL, N'customer32@example.com', N'0983730253', N'606 Đường I, TP. Thủ Đức, TP.HCM', N'Event', N'prospect', N'Warm,Tiềm năng', NULL, '2025-06-12 08:00:00', 2),
  (N'Đặng Lan', N'Delta Solutions', N'customer33@example.com', N'0916872034', N'101 Đường D, Quận Phú Nhuận, TP.HCM', N'Event', N'prospect', N'Hot,Warm', 5821081.79, '2025-06-15 11:30:00', 3),
  (N'Huỳnh Minh', N'Delta Solutions', N'customer34@example.com', N'0902721787', NULL, N'Website', N'prospect', N'Hot,Cũ', 7430445.7, '2025-06-12 08:00:00', 3),
  (N'Trần Thị Hoa', N'ABC Corp', N'customer35@example.com', N'0912646765', N'202 Đường E, Quận Bình Thạnh, TP.HCM', N'Social Media', N'prospect', N'Cũ,Cold', 8781272.71, '2025-06-14 17:30:00', 1),
  (N'Đặng Trang', N'ABC Corp', N'customer36@example.com', N'0901086710', N'123 Đường A, Quận 1, TP.HCM', N'Website', N'prospect', N'VIP,Tiềm năng', NULL, '2025-06-06 17:00:00', 2),
  (N'Nguyễn Văn Phúc', N'VinaTech', N'customer37@example.com', N'0971642263', N'456 Đường B, Quận 3, TP.HCM', N'Event', N'prospect', N'Cũ,Tiềm năng', NULL, '2025-06-15 15:00:00', 1),
  (N'Nguyễn Văn Tuấn', N'XYZ Ltd', N'customer38@example.com', N'0909645675', N'202 Đường E, Quận Bình Thạnh, TP.HCM', N'Social Media', N'prospect', N'Cold,Tiềm năng', 9164120.16, '2025-06-02 10:30:00', 2),
  (N'Nguyễn Văn Anh', NULL, N'customer39@example.com', N'0989605043', N'456 Đường B, Quận 3, TP.HCM', N'Event', N'prospect', N'VIP,Warm', 6507476.67, '2025-06-08 12:30:00', 2),
  (N'Nguyễn Văn Hoa', NULL, N'customer40@example.com', N'0911869114', N'789 Đường C, Quận 5, TP.HCM', N'Social Media', N'inactive', N'Cold', NULL, '2025-06-10 16:00:00', 3),
  (N'Phan Lan', N'ABC Corp', N'customer41@example.com', N'0916090459', NULL, N'Cold Call', N'inactive', N'Warm', NULL, '2025-06-05 08:00:00', 1),
  (N'Đặng Huy', N'Delta Solutions', N'customer42@example.com', N'0904835302', N'456 Đường B, Quận 3, TP.HCM', N'Social Media', N'prospect', N'Khách hàng thân thiết,VIP', 2351622.28, '2025-06-18 17:30:00', 1),
  (N'Nguyễn Văn Hoa', N'XYZ Ltd', N'customer43@example.com', N'0911262960', N'505 Đường H, Quận Tân Phú, TP.HCM', N'Cold Call', N'prospect', N'Cold', NULL, '2025-06-04 13:30:00', 2),
  (N'Huỳnh Thảo', N'Omega Co', N'customer44@example.com', N'0984697933', NULL, N'Cold Call', N'prospect', N'Khách hàng thân thiết,Hot', 5977668.45, '2025-06-09 17:00:00', 1),
  (N'Võ Phúc', NULL, N'customer45@example.com', N'0982211152', N'303 Đường F, Quận Gò Vấp, TP.HCM', N'Cold Call', N'inactive', N'Tiềm năng', NULL, '2025-06-01 11:30:00', 2),
  (N'Vũ Lan', N'XYZ Ltd', N'customer46@example.com', N'0976754159', NULL, N'Cold Call', N'prospect', N'Cold,Khách hàng thân thiết', 8055598.71, '2025-06-17 17:00:00', 3),
  (N'Phan Tuấn', N'VinaTech', N'customer47@example.com', N'0985882721', N'404 Đường G, Quận Tân Bình, TP.HCM', N'Social Media', N'prospect', N'Tiềm năng', 2313156.56, '2025-06-21 09:00:00', 2),
  (N'Phan Tuấn', N'Omega Co', N'customer48@example.com', N'0917805182', NULL, N'Social Media', N'active', N'Cũ,Hot', 581668.16, '2025-06-15 16:30:00', 1),
  (N'Huỳnh Hoa', N'Omega Co', N'customer49@example.com', N'0975630104', NULL, N'Website', N'prospect', N'Warm', 7304576.14, '2025-06-01 17:00:00', 3),
  (N'Bùi Hương', N'VinaTech', N'customer50@example.com', N'0911923327', N'404 Đường G, Quận Tân Bình, TP.HCM', N'Website', N'active', N'Tiềm năng', NULL, '2025-06-18 15:00:00', 3);
GO

-- 3. Dữ liệu mẫu cho bảng deals
DELETE FROM dbo.deals;
GO

-- 3 dịch vụ mẫu
DECLARE @services TABLE (title NVARCHAR(255), value DECIMAL(15,2));
INSERT INTO @services (title, value) VALUES
  (N'Gói học thử', 0),
  (N'Gói học chính thức', 5000000),
  (N'Gói combo', 8000000);

-- Gán mỗi khách hàng 1 deal thuộc 1 trong 3 dịch vụ
DECLARE @i INT = 1;
WHILE @i <= 50
BEGIN
  DECLARE @serviceIndex INT = ((@i - 1) % 3) + 1;
  DECLARE @title NVARCHAR(255);
  DECLARE @value DECIMAL(15,2);
  SELECT @title = title, @value = value FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS rn, * FROM @services
  ) s WHERE s.rn = @serviceIndex;
  INSERT INTO dbo.deals (title, customer_id, value, stage, probability, expected_close_date, description, owner_id)
  VALUES (
    @title,
    @i,
    @value,
    N'Đăng ký',
    100,
    DATEADD(day, 30, GETDATE()),
    N'Khách hàng đăng ký ' + @title,
    2
  );
  SET @i = @i + 1;
END
GO

-- 4. Dữ liệu mẫu cho bảng activities
INSERT INTO dbo.activities (type, description, customer_id, deal_id, user_id, activity_date)
VALUES
    (N'Call',    N'Gọi điện trao đổi nhu cầu',         1, 1, 2, '2025-06-16 10:00'),
    (N'Email',   N'Gửi báo giá chi tiết',              2, 2, 3, '2025-06-12 14:30'),
    (N'Meeting', N'Họp trực tiếp tại văn phòng khách',3, 3, 2, '2025-06-18 09:00');
GO

-- 5. Dữ liệu mẫu cho bảng reminders
INSERT INTO dbo.reminders (title, description, reminder_date, deal_id, customer_id, user_id)
VALUES
    (N'Follow-up Gói A',    N'Nhắc gọi lại khách hàng để chốt hợp đồng.', '2025-06-25 09:00', 1, 1, 2),
    (N'Gửi hợp đồng B',     N'Soạn & gửi hợp đồng cho khách XYZ Ltd.',       '2025-06-28 15:00', 2, 2, 3),
    (N'Thảo luận gói C',    N'Hẹn khách Lý Thị F vào tuần tới.',             '2025-07-02 11:00', 3, 3, 2);
GO
