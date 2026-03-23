-- Add Demo and Meeting activities for Deal 80 (Hỗ trợ kỹ thuật)
-- Customer: Trần Thị Thảo (ID: 34)
-- Owner: Lê Văn C (ID: 3)

USE CustomerManagement;
GO

-- Insert Demo activity
INSERT INTO activities (type, description, customer_id, deal_id, user_id, activity_date, created_at, updated_at)
VALUES (
    N'Demo',
    N'Tổ chức buổi demo sản phẩm cho khách hàng, giới thiệu các tính năng chính',
    34, -- Trần Thị Thảo
    80, -- Deal: Hỗ trợ kỹ thuật
    3,  -- Lê Văn C
    '2026-01-15 10:00:00',
    GETDATE(),
    GETDATE()
);

-- Insert Meeting activity
INSERT INTO activities (type, description, customer_id, deal_id, user_id, activity_date, created_at, updated_at)
VALUES (
    N'Meeting',
    N'Họp với khách hàng để thảo luận yêu cầu và lộ trình triển khai',
    34, -- Trần Thị Thảo
    80, -- Deal: Hỗ trợ kỹ thuật
    3,  -- Lê Văn C
    '2026-01-20 14:00:00',
    GETDATE(),
    GETDATE()
);

-- Verify the activities
SELECT 
    a.id,
    a.type,
    a.description,
    a.customer_id,
    c.name as customer_name,
    a.deal_id,
    d.title as deal_title,
    a.user_id,
    u.name as user_name,
    a.activity_date,
    a.created_at
FROM activities a
LEFT JOIN customers c ON a.customer_id = c.id
LEFT JOIN deals d ON a.deal_id = d.id
LEFT JOIN users u ON a.user_id = u.id
WHERE a.deal_id = 80
ORDER BY a.activity_date DESC;

PRINT 'Successfully added 2 activities for Deal 80';
