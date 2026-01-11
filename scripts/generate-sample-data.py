"""
Generate sample data for CRM Database
Tạo dữ liệu mẫu từ 12/2025 - 01/2026
"""
import random
from datetime import datetime, timedelta

# Vietnamese names pool
FIRST_NAMES = ["Nguyễn Văn", "Trần Thị", "Lê Văn", "Phạm Thị", "Hoàng", "Phan", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Võ", "Huỳnh"]
LAST_NAMES = ["An", "Bình", "Chi", "Dung", "Hà", "Huy", "Lan", "Minh", "Nam", "Phúc", "Quân", "Thảo", "Trang", "Tuấn", "Hoa", "Linh"]
COMPANIES = ["ABC Corp", "XYZ Ltd", "VinaTech", "Delta Solutions", "Omega Co", "Alpha Group", "Beta Systems", "Gamma Industries"]
SOURCES = ["Website", "Social Media", "Referral", "Cold Call", "Event", "Email Campaign"]
CUSTOMER_STATUSES = ["active", "prospect", "inactive"]
TAGS = ["VIP", "Hot", "Warm", "Cold", "Tiềm năng", "Khách hàng thân thiết"]
DEAL_STAGES = ["Đăng ký", "prospect", "demo", "proposal", "negotiation", "won", "lost"]
DEAL_TITLES = [
    "Gói học thử", "Gói học cơ bản", "Gói học nâng cao", "Gói học VIP", "Gói combo",
    "Tư vấn chiến lược", "Dịch vụ tối ưu", "Giải pháp tích hợp", "Hỗ trợ kỹ thuật"
]
ACTIVITY_TYPES = ["Call", "Email", "Meeting", "Demo", "Follow-up"]

def random_date(start_date, end_date):
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    random_hours = random.randint(8, 18)
    random_minutes = random.choice([0, 15, 30, 45])
    return start_date + timedelta(days=random_days, hours=random_hours, minutes=random_minutes)

def random_phone():
    return f"09{random.randint(10000000, 99999999)}"

def random_address():
    streets = ["Đường A", "Đường B", "Đường C", "Đường D", "Đường E", "Đường F"]
    districts = ["Quận 1", "Quận 3", "Quận 5", "Quận 7", "Quận Bình Thạnh", "Quận Tân Bình", "Quận Phú Nhuận"]
    return f"{random.randint(100, 999)} {random.choice(streets)}, {random.choice(districts)}, TP.HCM"

# Date ranges
START_DATE = datetime(2025, 12, 1)
END_DATE = datetime(2026, 1, 27)  # Current date

print("-- ======================================")
print("-- GENERATED SAMPLE DATA")
print(f"-- Date range: {START_DATE.strftime('%Y-%m-%d')} to {END_DATE.strftime('%Y-%m-%d')}")
print("-- ======================================")
print()

# Users
print("-- Users")
print("DELETE FROM dbo.users;")
print("DBCC CHECKIDENT ('users', RESEED, 0);")
print("GO")
print()
users = [
    {"name": "Nguyễn Văn A", "email": "nva@example.com", "role": "admin"},
    {"name": "Trần Thị B", "email": "ttb@example.com", "role": "sales"},
    {"name": "Lê Văn C", "email": "lvc@example.com", "role": "sales"},
    {"name": "Phạm Thị D", "email": "ptd@example.com", "role": "marketing"},
]
print("INSERT INTO dbo.users (name, email, password_hash, role) VALUES")
for i, user in enumerate(users):
    comma = "," if i < len(users) - 1 else ";"
    print(f"  (N'{user['name']}', '{user['email']}', 'hash_pwd_{i+1}', '{user['role']}'){comma}")
print("GO")
print()

# Customers
print("-- Customers (50)")
print("DELETE FROM dbo.customers;")
print("DBCC CHECKIDENT ('customers', RESEED, 0);")
print("GO")
print()
print("INSERT INTO dbo.customers (name, company, email, phone, address, source, status, tags, total_value, last_contact, created_by) VALUES")
for i in range(50):
    name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
    company = random.choice(COMPANIES) if random.random() > 0.2 else "NULL"
    email = f"customer{i+1}@example.com"
    phone = random_phone()
    address = f"N'{random_address()}'" if random.random() > 0.2 else "NULL"
    source = random.choice(SOURCES)
    status = random.choice(CUSTOMER_STATUSES)
    tags = ",".join(random.sample(TAGS, k=random.randint(1, 3)))
    total_value = random.randint(1000000, 15000000) if random.random() > 0.3 else 0
    last_contact = random_date(START_DATE, END_DATE)
    created_by = random.randint(1, 4)
    
    company_str = f"N'{company}'" if company != "NULL" else "NULL"
    total_value_str = str(total_value) if total_value > 0 else "NULL"
    comma = "," if i < 49 else ";"
    
    print(f"  (N'{name}', {company_str}, '{email}', '{phone}', {address}, N'{source}', '{status}', N'{tags}', {total_value_str}, '{last_contact.strftime('%Y-%m-%d %H:%M:%S')}', {created_by}){comma}")
print("GO")
print()

# Deals với diverse stages
print("-- Deals (80 deals với đa dạng stages)")
print("DELETE FROM dbo.deals;")
print("DBCC CHECKIDENT ('deals', RESEED, 0);")
print("GO")
print()
print("INSERT INTO dbo.deals (title, customer_id, value, stage, probability, expected_close_date, actual_close_date, description, owner_id, created_at) VALUES")

stage_distribution = {
    "Đăng ký": 20,      # 20 deals
    "prospect": 15,     # 15 deals
    "demo": 12,         # 12 deals
    "proposal": 10,     # 10 deals
    "negotiation": 8,   # 8 deals
    "won": 10,          # 10 deals (thành công)
    "lost": 5           # 5 deals (thất bại)
}

deal_count = 0
for stage, count in stage_distribution.items():
    for i in range(count):
        deal_count += 1
        customer_id = random.randint(1, 50)
        title = random.choice(DEAL_TITLES)
        
        # Value based on stage
        if stage == "won":
            value = random.randint(5000000, 20000000)
        elif stage == "lost":
            value = random.randint(2000000, 10000000)
        elif stage == "Đăng ký":
            value = random.choice([0, 4260000])  # Free trial or paid
        else:
            value = random.randint(3000000, 15000000)
        
        # Probability based on stage
        probability_map = {
            "Đăng ký": 20, "prospect": 30, "demo": 50, 
            "proposal": 60, "negotiation": 75, "won": 100, "lost": 0
        }
        probability = probability_map.get(stage, 50)
        
        created_at = random_date(START_DATE, END_DATE - timedelta(days=7))
        expected_close = random_date(created_at + timedelta(days=7), END_DATE + timedelta(days=30))
        
        # Actual close date only for won/lost
        if stage == "won":
            actual_close = random_date(created_at + timedelta(days=10), END_DATE)
            actual_close_str = f"'{actual_close.strftime('%Y-%m-%d')}'"
        elif stage == "lost":
            actual_close = random_date(created_at + timedelta(days=5), END_DATE)
            actual_close_str = f"'{actual_close.strftime('%Y-%m-%d')}'"
        else:
            actual_close_str = "NULL"
        
        description = f"Khách hàng quan tâm đến {title}"
        owner_id = random.choice([2, 3])  # Sales users
        
        comma = "," if deal_count < 80 else ";"
        print(f"  (N'{title}', {customer_id}, {value}, N'{stage}', {probability}, '{expected_close.strftime('%Y-%m-%d')}', {actual_close_str}, N'{description}', {owner_id}, '{created_at.strftime('%Y-%m-%d %H:%M:%S')}'){comma}")

print("GO")
print()

# Activities
print("-- Activities (30 recent activities)")
print("DELETE FROM dbo.activities;")
print("DBCC CHECKIDENT ('activities', RESEED, 0);")
print("GO")
print()
print("INSERT INTO dbo.activities (type, description, customer_id, deal_id, user_id, activity_date, created_at) VALUES")

activities_descriptions = {
    "Call": ["Gọi điện trao đổi nhu cầu", "Tư vấn giải pháp qua điện thoại", "Follow-up khách hàng"],
    "Email": ["Gửi báo giá chi tiết", "Gửi tài liệu giới thiệu sản phẩm", "Email cảm ơn sau cuộc họp"],
    "Meeting": ["Họp trực tiếp tại văn phòng khách", "Demo sản phẩm online", "Thuyết trình giải pháp"],
    "Demo": ["Demo tính năng A", "Trải nghiệm sản phẩm thực tế", "Workshop hướng dẫn"],
    "Follow-up": ["Nhắc lịch meeting", "Theo dõi tiến độ đơn hàng", "Chăm sóc khách hàng sau bán"]
}

for i in range(30):
    activity_type = random.choice(ACTIVITY_TYPES)
    description = random.choice(activities_descriptions[activity_type])
    customer_id = random.randint(1, 50)
    deal_id = random.randint(1, 80) if random.random() > 0.3 else "NULL"
    user_id = random.choice([2, 3, 4])
    activity_date = random_date(START_DATE, END_DATE)
    created_at = activity_date
    
    comma = "," if i < 29 else ";"
    print(f"  (N'{activity_type}', N'{description}', {customer_id}, {deal_id}, {user_id}, '{activity_date.strftime('%Y-%m-%d %H:%M:%S')}', '{created_at.strftime('%Y-%m-%d %H:%M:%S')}'){comma}")

print("GO")
print()

# Reminders
print("-- Reminders (10 upcoming)")
print("DELETE FROM dbo.reminders;")
print("DBCC CHECKIDENT ('reminders', RESEED, 0);")
print("GO")
print()
print("INSERT INTO dbo.reminders (title, description, reminder_date, deal_id, customer_id, user_id, status) VALUES")

reminder_titles = [
    "Follow-up với khách hàng", "Gửi báo giá", "Chuẩn bị demo", 
    "Họp review dự án", "Ký hợp đồng", "Thanh toán đợt 1",
    "Chăm sóc khách hàng", "Meeting tuần", "Gọi điện nhắc nhở", "Training nhóm"
]

for i in range(10):
    title = random.choice(reminder_titles)
    description = f"Chi tiết: {title} - deadline quan trọng"
    reminder_date = random_date(END_DATE, END_DATE + timedelta(days=30))
    deal_id = random.randint(1, 80) if random.random() > 0.3 else "NULL"
    customer_id = random.randint(1, 50) if deal_id == "NULL" or random.random() > 0.5 else "NULL"
    user_id = random.choice([2, 3])
    status = random.choice(["pending", "pending", "pending", "completed"])  # More pending
    
    comma = "," if i < 9 else ";"
    print(f"  (N'{title}', N'{description}', '{reminder_date.strftime('%Y-%m-%d %H:%M:%S')}', {deal_id}, {customer_id}, {user_id}, '{status}'){comma}")

print("GO")
print()
print("-- Data generation completed!")
