# DEMO TEST - USE CASE CHÍNH
## Hệ thống CRM - Customer Relationship Management

**Mục đích**: Kịch bản kiểm thử ngắn gọn cho demo thuyết trình  
**Thời lượng**: 10-12 phút  
**Ngày**: 13/01/2026

---

## 1. DANH SÁCH USE CASE CHÍNH

### UC01: Đăng nhập & Xác thực người dùng
- **Mục tiêu MIS**: Đảm bảo bảo mật, phân quyền theo vai trò (RBAC)
- **Actor**: Admin, Sales, Marketing
- **Preconditions**: Hệ thống đã có database, server Next.js chạy port 3000
- **Data demo**:
  - Admin: `nva@example.com` / `admin123`
  - Sales: `ttb@example.com` / `sales123`
  - Marketing: `ptd@example.com` / `marketing123`

### UC02: Xem Dashboard & KPI tổng quan
- **Mục tiêu MIS**: Cung cấp thông tin ra quyết định cho cấp quản lý (MIS Level 2-3)
- **Actor**: Admin, Sales Manager
- **Preconditions**: Đã đăng nhập thành công
- **Data demo**:
  - 50 customers trong DB
  - 80 deals phân bổ: 20 Đăng ký, 15 Prospect, 12 Demo, 10 Proposal, 8 Negotiation, 10 Won, 5 Lost
  - KPI: Tỷ lệ chuyển đổi, doanh thu pipeline, khách hàng mới tháng này

### UC03: Quản lý Khách hàng (CRUD)
- **Mục tiêu MIS**: Tập trung hóa dữ liệu khách hàng, loại bỏ Excel phân tán
- **Actor**: Sales, Admin
- **Preconditions**: Đã đăng nhập với role Sales/Admin
- **Data demo**:
  - Customer mẫu: "Nguyễn Văn Test", "Công ty ABC Test", email `test@crm.com`, phone `0901234567`
  - Tags: VIP, Hot, Warm, Cold
  - Status: active, prospect, inactive

### UC04: Quản lý Deals/Cơ hội bán hàng
- **Mục tiêu MIS**: Theo dõi pipeline, tối ưu quy trình chuyển đổi từ lead → customer
- **Actor**: Sales, Admin
- **Preconditions**: Đã có ít nhất 1 customer trong hệ thống
- **Data demo**:
  - Deal mẫu: "Dự án CRM cho SME", Customer ID=1, Value=50.000.000 VNĐ
  - Stage: Đăng ký → prospect → demo → proposal → won
  - Probability: 20% → 40% → 60% → 80% → 100%

### UC05: Xem chi tiết Khách hàng
- **Mục tiêu MIS**: 360° view - lịch sử tương tác, deals liên quan, activities
- **Actor**: Sales, Marketing
- **Preconditions**: Có customer với ID hợp lệ
- **Data demo**:
  - Customer ID=1: Đặng Hà, ABC Corp
  - Deals liên quan: 2-3 deals ở các stage khác nhau
  - Activities: Calls, Emails, Meetings (30 records mẫu)

### UC06: Quản lý người dùng & Phân quyền
- **Mục tiêu MIS**: RBAC - Admin quản lý users, assign roles, kiểm soát quyền truy cập
- **Actor**: Admin only
- **Preconditions**: Đăng nhập với role=admin
- **Data demo**:
  - 4 users: 1 admin, 2 sales, 1 marketing
  - Permission matrix hiển thị quyền theo role
  - Status: active/inactive

---

## 2. KỊCH BẢN KIỂM THỬ

### TC01-A: Đăng nhập thành công (Happy Path)
**Steps**:
1. Mở browser, truy cập `http://localhost:3000/login`
2. Nhập email: `nva@example.com`
3. Nhập password: `admin123`
4. Click nút "Đăng nhập"
5. Chờ redirect

**Expected Result**:
- Redirect về `/dashboard` trong < 2s
- Token JWT lưu vào localStorage
- Hiển thị tên user "Nguyễn Văn A" ở sidebar
- Role badge hiển thị "Admin"

### TC01-B: Đăng nhập thất bại - Sai mật khẩu
**Steps**:
1. Truy cập `/login`
2. Nhập email: `nva@example.com`
3. Nhập password: `wrong_password`
4. Click "Đăng nhập"

**Expected Result**:
- Alert hoặc toast hiển thị "Đăng nhập thất bại"
- Không redirect, ở lại trang login
- Token không được tạo

---

### TC02-A: Xem Dashboard với KPI đầy đủ (Happy Path)
**Steps**:
1. Đăng nhập với admin
2. Vào route `/dashboard`
3. Kiểm tra 4 KPI cards: Khách hàng mới, Cơ hội mở, Doanh thu tiềm năng, Tỷ lệ thành công
4. Scroll xuống xem Pipeline visualization (6 stages)
5. Kiểm tra Recent Activities (5 records gần nhất)

**Expected Result**:
- KPI cards load trong < 3s
- Pipeline hiển thị: Đăng ký (20), prospect (15), demo (12), proposal (10), won (10), lost (5)
- Chart hoặc progress bar màu sắc theo stage
- Activities sắp xếp theo `activity_date` DESC

### TC02-B: Dashboard không có dữ liệu
**Steps**:
1. Xóa tất cả deals/customers từ DB (hoặc dùng DB test rỗng)
2. Refresh `/dashboard`

**Expected Result**:
- KPI cards hiển thị giá trị = 0
- Pipeline rỗng, message "Chưa có dữ liệu"
- Không bị crash, UI vẫn ổn định

---

### TC03-A: Thêm khách hàng mới (Happy Path)
**Steps**:
1. Vào `/customers`
2. Click nút "Thêm khách hàng"
3. Nhập: Name="Lê Văn Demo", Company="Demo Corp", Email=`demo@test.com`, Phone=`0909123456`
4. Chọn Status="prospect", Source="Website"
5. Tags="Hot,VIP"
6. Click "Lưu"

**Expected Result**:
- Modal đóng, table refresh
- Customer mới xuất hiện đầu tiên trong danh sách
- Badge hiển thị status="Tiềm năng" (màu vàng)
- Tags hiển thị đúng màu (Hot=đỏ, VIP=tím)

### TC03-B: Thêm khách hàng thiếu trường bắt buộc
**Steps**:
1. Click "Thêm khách hàng"
2. Chỉ nhập Name, bỏ trống Email
3. Click "Lưu"

**Expected Result**:
- Validation error: "Email là trường bắt buộc"
- Modal không đóng
- Không insert DB

---

### TC04-A: Tạo Deal mới và theo dõi pipeline (Happy Path)
**Steps**:
1. Vào `/deals`
2. Click "Tạo cơ hội mới"
3. Nhập: Title="Gói Premium Q1", Customer=chọn "Công ty ABC", Value=100000000
4. Stage="Đăng ký", Probability=20%, Expected Close Date=2026-02-15
5. Click "Lưu"
6. Kiểm tra deal xuất hiện trong table với stage badge màu tím

**Expected Result**:
- Deal tạo thành công, `owner_id` = current user ID
- Stage="Đăng ký", badge màu tím
- Value format: `100.000.000 đ`
- Probability hiển thị 20%

### TC04-B: Cập nhật Deal stage từ Đăng ký → Won
**Steps**:
1. Tìm deal ID=1 (stage=Đăng ký)
2. Click Edit
3. Đổi stage="won", probability=100%, actual_close_date=hôm nay
4. Lưu
5. Refresh `/dashboard`, kiểm tra "Tỷ lệ thành công" tăng

**Expected Result**:
- Stage badge đổi từ tím → xanh lá ("Thành công")
- Actual_close_date được set
- KPI "Tỷ lệ thành công" tăng từ 12% → 13% (ví dụ)

---

### TC05-A: Xem chi tiết khách hàng 360° (Happy Path)
**Steps**:
1. Vào `/customers`
2. Click vào customer "Đặng Hà" (ID=1)
3. Route `/customers/1` load
4. Kiểm tra sections: Thông tin cơ bản, Tags, Deals liên quan, Activities

**Expected Result**:
- URL: `/customers/1`
- Hiển thị: Name, Company, Email, Phone, Address
- Tags render đúng màu
- Deals table hiển thị 2-3 deals của customer này
- Activities hiển thị Call/Email/Meeting history

### TC05-B: Xem customer không tồn tại
**Steps**:
1. Truy cập trực tiếp `/customers/9999`

**Expected Result**:
- Message "Không tìm thấy khách hàng"
- Nút "Quay lại" redirect về `/customers`
- Không crash

---

### TC06-A: Admin quản lý users (Happy Path)
**Steps**:
1. Đăng nhập với admin
2. Vào `/settings`
3. Tab "Quản lý người dùng"
4. Click "Thêm người dùng"
5. Nhập: Name="Trần Test", Email=`ttest@crm.com`, Role="sales", Password="123456"
6. Lưu
7. User mới xuất hiện, role badge="Sales" (màu xanh)

**Expected Result**:
- User tạo thành công, password được hash bcrypt
- Role="sales" → badge màu xanh
- Status mặc định="active"
- Last_login = NULL

### TC06-B: User Sales không thấy Settings
**Steps**:
1. Đăng nhập với `ttb@example.com` (role=sales)
2. Thử truy cập `/settings`

**Expected Result**:
- Nếu có guard: redirect về `/dashboard` hoặc 403
- Nếu không guard: hiển thị nhưng không có tab "Quản lý người dùng"
- Chỉ Admin mới thấy user management

---

## 3. DEMO FLOW TIMELINE (10-12 PHÚT)

### Phút 0-2: Giới thiệu & Login (UC01)
**Thực hiện**:
- Mở app, giới thiệu màn login
- Demo đăng nhập admin: `nva@example.com`
- Thông điệp: "JWT authentication, bcrypt hash, RBAC từ đầu"

### Phút 2-4: Dashboard KPI (UC02)
**Thực hiện**:
- Giải thích 4 KPI cards
- Pipeline visualization: Đăng ký → Won/Lost
- Recent Activities
- **Thông điệp MIS**: "Cung cấp thông tin cho cấp quản lý, ra quyết định nhanh - Managerial Level MIS"

### Phút 4-6: Quản lý Customers (UC03)
**Thực hiện**:
- Vào `/customers`, hiển thị 50 records
- Demo search: tìm "Đặng Hà"
- Filter by status: active/prospect/inactive
- Tạo customer mới trực tiếp: "Demo Customer ABC"
- **Thông điệp MIS**: "Single source of truth - Tập trung hóa dữ liệu khách hàng, thay Excel phân tán"

### Phút 6-8: Quản lý Deals & Pipeline (UC04)
**Thực hiện**:
- Vào `/deals`, hiển thị pipeline
- Filter by stage
- Tạo deal mới: "Gói Premium Demo", value=100M
- Giải thích probability scoring
- **Thông điệp MIS**: "Pipeline management - Tối ưu conversion rate, forecast doanh thu"

### Phút 8-10: Chi tiết Customer 360° (UC05)
**Thực hiện**:
- Click vào customer "Đặng Hà"
- Hiển thị: Info + Deals + Activities
- Giải thích lịch sử tương tác
- **Thông điệp MIS**: "360° customer view - Chuyển giao công việc dễ dàng, onboard nhân viên mới nhanh"

### Phút 10-12: Settings & RBAC (UC06)
**Thực hiện**:
- Vào `/settings`
- Hiển thị 4 users, permission matrix
- Giải thích role: admin/sales/marketing
- **Thông điệp MIS**: "RBAC - Bảo mật dữ liệu, kiểm soát quyền truy cập, tuân thủ chính sách công ty"

---

## 4. CHECKLIST TRƯỚC KHI DEMO (2 PHÚT)

### ✅ Infrastructure
- [ ] SQL Server đang chạy (kiểm tra port 1433)
- [ ] Database `CustomerManagement` có đủ 5 tables
- [ ] Sample data đã insert: 50 customers, 80 deals, 30 activities, 4 users

### ✅ Application
- [ ] Next.js dev server chạy: `npm run dev` → port 3000
- [ ] Truy cập được `http://localhost:3000/login`
- [ ] Không có errors trong console
- [ ] JWT secret đã set trong `.env.local`

### ✅ Demo Data
- [ ] Test login: `nva@example.com` / `admin123` → OK
- [ ] Dashboard load < 3s, KPI hiển thị đúng
- [ ] `/customers` có ít nhất 50 records
- [ ] `/deals` có pipeline đầy đủ 6 stages

### ✅ Môi trường demo
- [ ] Mạng ổn định (nếu demo online)
- [ ] Browser tab đóng các trang không liên quan
- [ ] Zoom level = 100% (UI không bị vỡ)
- [ ] Mở sẵn 3 tabs: login, dashboard, customers

### ✅ Backup Plan
- [ ] Có video demo sẵn (nếu live demo fail)
- [ ] PowerPoint backup slides
- [ ] Test trên máy dự phòng

---

## 5. KẾT QUẢ MONG ĐỢI

**Sau khi hoàn thành demo test, hệ thống phải chứng minh được**:

### Giá trị MIS
1. **Operational Level**: CRUD khách hàng, deals, activities → Tác nghiệp hàng ngày
2. **Managerial Level**: Dashboard KPI, pipeline visualization → Theo dõi hiệu suất team
3. **Strategic Level**: Forecast doanh thu, phân tích xu hướng → Ra quyết định chiến lược

### Kỹ thuật
1. JWT authentication hoạt động
2. RBAC phân quyền đúng
3. Database đầy đủ foreign keys, constraints, triggers
4. UI responsive, load nhanh < 3s
5. Không có errors, bugs nghiêm trọng

### Demo thành công nếu
- ✅ 6 use cases chính PASS
- ✅ Không crash trong quá trình demo
- ✅ Thời gian đúng 10-12 phút
- ✅ Trả lời được câu hỏi về MIS value proposition

---

## 6. CÂU HỎI & TRẢ LỜI - PHÂN TÍCH HỆ THỐNG

### Q1: Toàn bộ dự án có chỗ nào dùng mockdata không?

**TRẢ LỜI: CÓ - 3 CHỖ SỬ DỤNG MOCK DATA (HARDCODED)**

#### 1.1. Settings Page - Tags List (Mock Data)
**File**: `app/(dashboard)/settings/page.tsx` (dòng 51-57)
```javascript
const tags = [
  { id: 1, name: "VIP", color: "purple", count: 12 },
  { id: 2, name: "Enterprise", color: "blue", count: 8 },
  { id: 3, name: "SME", color: "green", count: 25 },
  { id: 4, name: "Startup", color: "orange", count: 15 },
  { id: 5, name: "Hot Lead", color: "red", count: 6 },
]
```
- **Vấn đề**: Tags này KHÔNG lấy từ database, là hard-coded
- **Hậu quả**: Khi user thêm/sửa tag khách hàng, danh sách này không tự động cập nhật
- **Cần sửa**: Tạo API `/api/tags` để query distinct tags từ `customers.tags`, đếm số lượng thật

#### 1.2. Settings Page - Integrations (Mock Data)
**File**: `app/(dashboard)/settings/page.tsx` (dòng 59-77)
```javascript
const integrations = [
  { name: "Google Calendar", description: "...", status: "connected", ... },
  { name: "Slack", description: "...", status: "disconnected", ... },
  { name: "Zapier", description: "...", status: "connected", ... },
]
```
- **Vấn đề**: Hoàn toàn giả lập, không có chức năng thật
- **Hậu quả**: Click vào không làm gì, chỉ UI demo
- **Cần sửa**: Tạo table `integrations` hoặc xóa bỏ nếu không cần

#### 1.3. Dashboard KPI - Percentage Changes (Mock Data)
**File**: `app/(dashboard)/dashboard/page.tsx` (dòng 137, 144, 151, 158)
```javascript
const kpiData = [
  { title: "Khách hàng mới", value: ..., change: "+12%", ... }, // Mock
  { title: "Cơ hội mở", value: ..., change: "+8%", ... },       // Mock
  { title: "Doanh thu dự kiến", value: ..., change: "-3%", ... }, // Mock
  { title: "Tỷ lệ thành công", value: ..., change: "+5%", ... },  // Mock
]
```
- **Vấn đề**: `change` ("+12%", "+8%", "-3%", "+5%") là hard-coded, KHÔNG tính toán thực tế
- **Hậu quả**: Hiển thị sai, không phản ánh trend thật so với tháng trước
- **Cần sửa**: Query dữ liệu tháng trước, tính % thay đổi thật: `(current - previous) / previous * 100`

**TỔNG KẾT**: 
- ✅ **Data thật từ DB**: Customers, Deals, Activities, Users
- ❌ **Mock data**: Tags list (settings), Integrations, KPI percentage changes

---

### Q2: 4 KPI Cards ở trang /dashboard có ý nghĩa gì?

**TRẢ LỜI: 4 KPI THEO DÕI HIỆU SUẤT KINH DOANH (MIS LEVEL 2)**

#### KPI 1: "Khách hàng mới"
**Code**: `app/(dashboard)/dashboard/page.tsx` dòng 9-17, 135-141
```javascript
function countNewCustomersThisMonth(customers: any[]): number {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  return customers.filter(c => {
    const created = new Date(c.created_at);
    return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
  }).length;
}
```
- **Ý nghĩa**: Số khách hàng được tạo trong tháng hiện tại (1-31/1/2026)
- **Giá trị MIS**: Đo lường hiệu quả marketing/sales trong tháng
- **So sánh**: "+12%" (mock) - nên là % thay đổi so với tháng trước thật

#### KPI 2: "Cơ hội mở"
**Code**: `app/(dashboard)/dashboard/page.tsx` dòng 142-148
```javascript
{ title: "Cơ hội mở", value: deals.length.toString(), ... }
```
- **Ý nghĩa**: Tổng số deals hiện tại trong hệ thống (không phân biệt stage)
- **Giá trị MIS**: Pipeline size - khối lượng công việc đang xử lý
- **Vấn đề**: Nên chỉ đếm deals ở stage `!== "won" && !== "lost"` (deals đang mở)

#### KPI 3: "Doanh thu dự kiến"
**Code**: `app/(dashboard)/dashboard/page.tsx` dòng 19-21, 149-155
```javascript
function totalDealValue(deals: any[]): number {
  return deals.reduce((sum, d) => sum + (d.value || 0), 0);
}
```
- **Ý nghĩa**: Tổng `value` của tất cả deals (bao gồm won, lost, đang chạy)
- **Giá trị MIS**: Forecast doanh thu tiềm năng nếu close hết deals
- **Vấn đề**: Nên tính `value * probability/100` để có weighted revenue forecast chính xác hơn

#### KPI 4: "Tỷ lệ thành công"
**Code**: `app/(dashboard)/dashboard/page.tsx` dòng 47-52, 156-162
```javascript
function successRate(deals: any[]): number {
  const total = deals.length;
  if (total === 0) return 0;
  const success = deals.filter(d => d.stage === 'won' || d.stage === 'thanhcong').length;
  return Math.round((success / total) * 100);
}
```
- **Ý nghĩa**: `(Số deals won / Tổng số deals) * 100%`
- **Giá trị MIS**: Win rate - đo lường khả năng close deals của team sales
- **Chú ý**: Hiện tại check 2 stage: `'won'` và `'thanhcong'` (có vẻ legacy)

**TỔNG KẾT**:
- KPI 1-2: Đo lường **số lượng** (khách hàng, cơ hội)
- KPI 3: Đo lường **tiềm năng doanh thu**
- KPI 4: Đo lường **hiệu suất chuyển đổi**
- **Mục đích MIS**: Cung cấp thông tin ra quyết định cho Manager (Managerial Level)

---

### Q3: Các "Tags" được gắn cho khách hàng có ý nghĩa gì và hoạt động theo nguyên lý nào?

**TRẢ LỜI: TAGS LÀ HỆ THỐNG PHÂN LOẠI KHÁCH HÀNG - LƯU TEXT, SPLIT KHI RENDER**

#### 3.1. Lưu trữ trong Database
**Schema**: `scripts/create-database.sql` dòng 53
```sql
CREATE TABLE dbo.customers (
  ...
  tags NVARCHAR(500),  -- Lưu dạng "VIP,Hot,Warm" (comma-separated)
  ...
)
```
- **Format**: Chuỗi text ngăn cách bởi dấu phẩy: `"VIP,Hot,Khách hàng thân thiết"`
- **Ví dụ thực tế**: 
  - Customer 2: `"Khách hàng thân thiết,Hot,Cold"`
  - Customer 9: `"Warm,Hot,VIP"`

#### 3.2. Định nghĩa màu sắc Tags
**File**: `app/(dashboard)/customers/page.tsx` dòng 38-51
```javascript
const tagColors: { [key: string]: string } = {
  VIP: 'bg-purple-100 text-purple-700 border-purple-200',
  New: 'bg-green-100 text-green-700 border-green-200',
  Returning: 'bg-blue-100 text-blue-700 border-blue-200',
  Important: 'bg-red-100 text-red-700 border-red-200',
  Loyal: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Blocked: 'bg-gray-300 text-gray-700 border-gray-400',
  Partner: 'bg-pink-100 text-pink-700 border-pink-200',
  Test: 'bg-orange-100 text-orange-700 border-orange-200',
  Internal: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Premium: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
};
```
- **Hard-coded**: Mapping tag name → Tailwind CSS classes
- **Vấn đề**: Tags trong DB có thể là bất kỳ text nào, nếu không match sẽ dùng `default` (màu xám)

#### 3.3. Render Tags trên UI
**File**: `app/(dashboard)/customers/page.tsx` (table cell)
```javascript
{customer.tags && customer.tags.split(',').map((tag: string, idx: number) => (
  <Badge key={idx} className={getTagColor(tag.trim())}>{tag.trim()}</Badge>
))}
```
- **Cách hoạt động**:
  1. Split chuỗi `"VIP,Hot,Warm"` thành array `["VIP", "Hot", "Warm"]`
  2. Loop qua từng tag, `trim()` bỏ khoảng trắng
  3. Gọi `getTagColor(tag)` lấy CSS class
  4. Render Badge với màu tương ứng

#### 3.4. Ý nghĩa nghiệp vụ của Tags
**Từ sample data**: `scripts/insert-sample-data.sql`
- **VIP**: Khách hàng quan trọng, ưu tiên cao
- **Hot**: Tiềm năng giao dịch cao, cần chăm sóc ngay
- **Warm**: Tiềm năng trung bình, theo dõi định kỳ
- **Cold**: Ít tiềm năng, chăm sóc thấp
- **Khách hàng thân thiết**: Loyal customers, đã giao dịch nhiều lần
- **Tiềm năng**: Prospect, chưa chốt deal

**NHƯỢC ĐIỂM HỆ THỐNG TAGS HIỆN TẠI**:
1. ❌ Không có table riêng → không quản lý tập trung
2. ❌ Dùng comma-separated string → khó query, filter, aggregate
3. ❌ Không có validation → user có thể nhập sai chính tả
4. ❌ Không có tag management UI → không thêm/sửa/xóa tags dễ dàng

**ĐỀ XUẤT CẢI THIỆN**:
- Tạo table `tags` (id, name, color, category)
- Tạo table `customer_tags` (customer_id, tag_id) - many-to-many relationship
- Cho phép admin quản lý danh sách tags trong `/settings`
- Filter customers theo tags với SQL JOIN

---

### Q4: "Giai đoạn" (Stage) có liên quan đến "Xác suất" (Probability) không ở trang /deals?

**TRẢ LỜI: KHÔNG TỰ ĐỘNG - NHƯNG CÓ QUY ƯỚC NGẦM TRONG SAMPLE DATA**

#### 4.1. Định nghĩa Stages
**File**: `app/(dashboard)/deals/page.tsx` dòng 52-58
```javascript
const stages = [
  { key: "Đăng ký", label: "Đăng ký", color: "bg-purple-500", ... },      // Stage 1
  { key: "prospect", label: "Tiềm năng", color: "bg-blue-500", ... },     // Stage 2
  { key: "demo", label: "Demo", color: "bg-yellow-500", ... },            // Stage 3
  { key: "proposal", label: "Đề xuất", color: "bg-orange-500", ... },     // Stage 4
  { key: "won", label: "Thành công", color: "bg-green-500", ... },        // Stage 5
  { key: "lost", label: "Thất bại", color: "bg-red-500", ... },           // Stage 6
]
```
- 6 stages đại diện cho sales pipeline: Registration → Win/Lost

#### 4.2. Phân tích Sample Data
**File**: `scripts/insert-sample-data.sql` dòng 81-221

| Stage       | Số deals | Probability điển hình | Pattern |
|-------------|----------|----------------------|---------|
| Đăng ký     | 20       | 20%                  | Mới vào pipeline |
| prospect    | 15       | 40%                  | Đã xác minh tiềm năng |
| demo        | 12       | 60%                  | Đã demo sản phẩm |
| proposal    | 10       | 80%                  | Đã gửi đề xuất |
| negotiation | 8        | 90%                  | Đang đàm phán |
| won         | 10       | 100%                 | Thành công |
| lost        | 5        | 0%                   | Thất bại |

**Ví dụ từ SQL**:
```sql
-- Đăng ký = 20%
INSERT INTO dbo.deals (..., stage, probability, ...) VALUES
  (N'Gói học nâng cao', 26, 0, N'Đăng ký', 20, ...),
  
-- prospect = 40%
INSERT INTO dbo.deals (..., stage, probability, ...) VALUES
  (N'Giải pháp ERP', 28, 7125000, N'prospect', 40, ...),
  
-- demo = 60%
INSERT INTO dbo.deals (..., stage, probability, ...) VALUES
  (N'Phần mềm quản lý', 26, 9225000, N'demo', 60, ...),
```

#### 4.3. Không có Auto-Update Logic
**Kiểm tra code**: `app/(dashboard)/deals/page.tsx`, `app/api/deals/route.ts`
- ✅ User chọn stage trong dropdown (dòng 145-153)
- ✅ User nhập probability riêng (dòng 157-165)
- ❌ **KHÔNG CÓ CODE** tự động set probability khi đổi stage
- ❌ **KHÔNG CÓ VALIDATION** đảm bảo probability phù hợp với stage

**Hậu quả**:
- User có thể tạo deal: stage="won" nhưng probability=20% (sai logic)
- Hoặc: stage="Đăng ký" nhưng probability=100% (không hợp lý)

#### 4.4. Probability Color Coding
**File**: `app/(dashboard)/deals/page.tsx` dòng 73-78
```javascript
const getProbabilityColor = (probability: number) => {
  if (probability >= 75) return "text-green-400"   // Xanh: Gần close
  if (probability >= 50) return "text-yellow-400"  // Vàng: Trung bình
  if (probability >= 25) return "text-orange-400"  // Cam: Thấp
  return "text-red-400"                            // Đỏ: Rất thấp
}
```
- Dùng để hiển thị màu sắc probability trên UI
- Độc lập với stage

**TỔNG KẾT**:
- ❌ **Không tự động**: Stage và Probability là 2 fields độc lập
- ✅ **Có quy ước**: Sample data tuân theo pattern (Đăng ký=20%, prospect=40%,...)
- ⚠️ **Thiếu validation**: User có thể nhập sai logic
- 🔧 **Cần sửa**: Thêm logic auto-suggest probability khi chọn stage, hoặc validation rule

**ĐỀ XUẤT CẢI THIỆN**:
```javascript
// Khi user chọn stage, tự động suggest probability
const stageProbabilityMap = {
  "Đăng ký": 20,
  "prospect": 40,
  "demo": 60,
  "proposal": 80,
  "negotiation": 90,
  "won": 100,
  "lost": 0
};

// Auto-fill khi chọn stage, cho phép user override
onStageChange = (stage) => {
  setProbability(stageProbabilityMap[stage]);
}
```

---

**Người chuẩn bị**: Business Analyst + Demo Lead  
**Version**: 1.1  
**Last updated**: 12/01/2026  
**Changelog**: Thêm Q&A phân tích hệ thống (mock data, KPI, tags, stage/probability)
