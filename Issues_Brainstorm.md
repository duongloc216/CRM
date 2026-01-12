# ISSUES BRAINSTORM - HỆ THỐNG CRM
## Phase 1: Nhận diện & Phân loại Vấn đề

**Dự án**: CRM - Customer Relationship Management  
**Trạng thái**: UI hoàn thiện, Dữ liệu mock, Chức năng cốt lõi KHÔNG hoạt động  
**Ngày phân tích**: 12/01/2026

---

## 1. TỔNG QUAN TÌNH TRẠNG HỆ THỐNG

### 1.1. Nhận định tổng thể

Hệ thống CRM hiện tại là một **"hộp rỗng đẹp"**:
- ✅ UI/UX hoàn chỉnh với shadcn/ui, responsive
- ✅ Database schema đầy đủ 5 tables với constraints, triggers
- ✅ Authentication flow (login) hoạt động
- ❌ **CRUD operations không hoạt động** (chỉ Read, không Create/Update/Delete)
- ❌ **KPI và metrics hiển thị sai** hoặc mock
- ❌ **Business logic thiếu** (validation, auto-calculation)
- ❌ **Data model issues** (comma-separated tags, không có relationships đúng)

### 1.2. Điểm "chết" theo góc nhìn MIS

| Cấp độ MIS | Tình trạng | Hệ quả |
|------------|------------|--------|
| **Operational Level** | ❌ Không nhập được dữ liệu mới | Sales không thể ghi nhận khách hàng, deals mới |
| **Managerial Level** | ⚠️ KPI mock/sai | Manager ra quyết định dựa trên số liệu sai |
| **Strategic Level** | ❌ Forecast không chính xác | Lập kế hoạch kinh doanh sai hướng |

### 1.3. Rủi ro demo hiện tại

- Demo chỉ có thể **xem** dữ liệu có sẵn
- Nếu người xem yêu cầu **"thử thêm 1 khách hàng mới"** → Fail
- KPI hiển thị **"+12%", "68%"** → Nếu hỏi "dựa trên đâu?" → Không trả lời được
- Revenue forecast → Nếu hỏi "tính toán như thế nào?" → Logic sai

---

## 2. NHÓM VẤN ĐỀ THEO KHU VỰC CHỨC NĂNG

### A. DASHBOARD & KPI

#### A1. KPI "Khách hàng mới" - Hoạt động nhưng thiếu so sánh
**File**: `app/(dashboard)/dashboard/page.tsx` dòng 9-17, 135-141
- **Vấn đề**: 
  - Giá trị `value` tính đúng (đếm customers tạo trong tháng)
  - `change: "+12%"` là **HARD-CODED**, không tính từ dữ liệu thật
  - `trend: "up"` cũng hard-coded
- **Hệ quả**: Hiển thị trend sai, đánh lừa manager

#### A2. KPI "Cơ hội mở" - Logic sai
**File**: `app/(dashboard)/dashboard/page.tsx` dòng 142-148
- **Vấn đề**: 
  - Đếm `deals.length` = TOÀN BỘ deals (bao gồm won và lost)
  - Định nghĩa "cơ hội mở" phải là deals đang trong pipeline (chưa closed)
  - `change: "+8%"` hard-coded
- **Hệ quả**: Số liệu sai, không phản ánh workload thực tế của sales team

#### A3. KPI "Doanh thu dự kiến" - Logic sai nghiêm trọng
**File**: `app/(dashboard)/dashboard/page.tsx` dòng 19-21, 149-155
- **Vấn đề**:
  - Công thức hiện tại: `SUM(deals.value)` - cộng tất cả
  - Bao gồm cả deals đã lost (không bao giờ thu được)
  - Bao gồm cả deals đã won (đã thu, không còn "dự kiến")
  - Không weighted theo probability
  - `change: "-3%"` hard-coded
- **Hệ quả**: Forecast hoàn toàn sai, không thể dùng để lập kế hoạch tài chính

#### A4. KPI "Tỷ lệ thành công" - Thiếu precision
**File**: `app/(dashboard)/dashboard/page.tsx` dòng 47-52, 156-162
- **Vấn đề**:
  - Công thức: `won / total * 100%`
  - Check 2 stage values: `'won'` và `'thanhcong'` (legacy, không nhất quán)
  - `change: "+5%"` hard-coded
  - Không phân biệt win rate theo period (tháng này vs tháng trước)
- **Hệ quả**: Không thể đánh giá trend hiệu suất sales

#### A5. "Doanh thu theo tháng" - Sắp xếp và logic sai
**File**: `app/(dashboard)/dashboard/page.tsx` dòng 54-68
- **Vấn đề**:
  - Dựa trên `expected_close_date`, không phải `actual_close_date`
  - "Doanh thu" phải là tiền đã thu được (won + actual_close), không phải "dự kiến"
  - Sắp xếp theo `localeCompare` có thể sai với format "Tháng X/YYYY"
  - Không có dữ liệu "Doanh thu thực tế" vs "Doanh thu kỳ vọng"
- **Hệ quả**: Biểu đồ hiển thị dữ liệu không có ý nghĩa kinh doanh

#### A6. Deals page - "Tỷ lệ thành công 68%" HARD-CODED
**File**: `app/(dashboard)/deals/page.tsx` dòng 228-237
- **Vấn đề**: `<div className="text-2xl font-bold text-black">68%</div>` - hoàn toàn hard-coded
- **Hệ quả**: Hiển thị sai, không liên quan đến dữ liệu thật

#### A7. Deals page - "Đến hạn: 3" HARD-CODED
**File**: `app/(dashboard)/deals/page.tsx` dòng 242-250
- **Vấn đề**: `<div className="text-2xl font-bold text-black">3</div>` - hard-coded
- **Hệ quả**: Không phản ánh deals thực sự sắp đến hạn

---

### B. CUSTOMERS - QUẢN LÝ KHÁCH HÀNG

#### B1. KHÔNG THỂ TẠO KHÁCH HÀNG MỚI
**Files**: 
- `app/(dashboard)/customers/page.tsx` dòng 247 (nút "Lưu khách hàng")
- `app/api/customers/route.ts` (chỉ có GET)
- **Vấn đề**:
  - Nút "Lưu khách hàng" **KHÔNG CÓ onClick handler**
  - API route **KHÔNG CÓ POST method**
  - Form inputs không có state binding (không lưu giá trị nhập)
  - Không có validation
- **Hệ quả**: 
  - Sales không thể nhập khách hàng mới vào hệ thống
  - Dữ liệu CRM không được cập nhật
  - **BLOCKING** - chức năng cốt lõi

#### B2. KHÔNG THỂ SỬA KHÁCH HÀNG
**File**: `app/(dashboard)/customers/page.tsx` dòng 331-334
- **Vấn đề**:
  - DropdownMenuItem "Chỉnh sửa" **KHÔNG CÓ onClick handler**
  - Không có Edit dialog/form
  - Không có API PUT/PATCH endpoint
- **Hệ quả**: Không thể cập nhật thông tin khách hàng khi thay đổi

#### B3. KHÔNG THỂ XÓA KHÁCH HÀNG
**File**: `app/(dashboard)/customers/page.tsx` dòng 335-338
- **Vấn đề**:
  - DropdownMenuItem "Xóa" **KHÔNG CÓ onClick handler**
  - Không có confirmation dialog
  - Không có API DELETE endpoint
- **Hệ quả**: Không thể xóa dữ liệu sai hoặc duplicate

#### B4. Tags không thể thêm/sửa khi tạo customer
**File**: `app/(dashboard)/customers/page.tsx` form dialog
- **Vấn đề**:
  - Form tạo customer KHÔNG CÓ trường nhập Tags
  - Tags chỉ có thể set qua SQL trực tiếp
- **Hệ quả**: Feature tags trở nên vô dụng cho user

#### B5. "Gói giao dịch" dropdown trong form - Logic nghiệp vụ sai
**File**: `app/(dashboard)/customers/page.tsx` dòng 224-234
- **Vấn đề**:
  - Khi tạo Customer, form yêu cầu chọn Deal
  - Logic CRM đúng: Customer tạo trước → Deal tạo sau (gắn với Customer)
  - Hiện tại đảo ngược workflow
- **Hệ quả**: UX confusing, không match với quy trình bán hàng thực tế

---

### C. DEALS / CƠ HỘI BÁN HÀNG

#### C1. KHÔNG THỂ TẠO DEAL MỚI
**Files**:
- `app/(dashboard)/deals/page.tsx` dòng 199-202 (nút "Tạo cơ hội")
- `app/api/deals/route.ts` (chỉ có GET)
- **Vấn đề**:
  - Nút "Tạo cơ hội" **KHÔNG CÓ onClick handler**
  - API route **KHÔNG CÓ POST method**
  - Form inputs không có state binding
- **Hệ quả**: 
  - Không thể ghi nhận cơ hội bán hàng mới
  - Pipeline không được cập nhật
  - **BLOCKING** - chức năng cốt lõi

#### C2. Dropdown "Khách hàng" - HARD-CODED OPTIONS
**File**: `app/(dashboard)/deals/page.tsx` dòng 120-131
- **Vấn đề**:
  - SelectItem values: "abc", "xyz", "def" - hard-coded
  - Labels: "Công ty TNHH ABC", "Doanh nghiệp XYZ" - không từ database
  - Không fetch danh sách customers thật
- **Hệ quả**: Không thể liên kết deal với customer thực tế

#### C3. Dropdown "Người phụ trách" - HARD-CODED OPTIONS
**File**: `app/(dashboard)/deals/page.tsx` dòng 174-186
- **Vấn đề**:
  - SelectItem values: "user1", "user2", "user3" - hard-coded
  - Labels: "Nguyễn Văn A", "Trần Thị B" - không từ database
  - Không fetch danh sách users thật
- **Hệ quả**: owner_id sẽ lưu sai, không map được với user thật

#### C4. KHÔNG THỂ XEM CHI TIẾT DEAL
**File**: `app/(dashboard)/deals/page.tsx` dòng 328-331
- **Vấn đề**:
  - "Xem chi tiết" không có onClick handler
  - Không có route `/deals/[id]` (kiểm tra file structure)
  - Không có API `/api/deals/[id]`
- **Hệ quả**: Không thể drill-down vào từng deal

#### C5. KHÔNG THỂ SỬA DEAL
**File**: `app/(dashboard)/deals/page.tsx` dòng 332-335
- **Vấn đề**: Tương tự B2 - không có handler, form, API
- **Hệ quả**: 
  - Không thể chuyển stage (Đăng ký → prospect → demo → won)
  - Không thể update probability
  - Pipeline bị "đóng băng"

#### C6. KHÔNG THỂ XÓA DEAL
**File**: `app/(dashboard)/deals/page.tsx` dòng 336-339
- **Vấn đề**: Tương tự B3
- **Hệ quả**: Không cleanup được deals lỗi

#### C7. Stage và Probability KHÔNG LIÊN KẾT
**File**: `app/(dashboard)/deals/page.tsx` form dialog
- **Vấn đề**:
  - User chọn stage và probability riêng biệt
  - Không có auto-suggest: khi chọn "won" → probability vẫn có thể là 20%
  - Không có validation logic
- **Hệ quả**: Dữ liệu không nhất quán, forecast sai

#### C8. Table hiển thị customer_id và owner_id thay vì tên
**File**: `app/(dashboard)/deals/page.tsx` dòng 307, 320
- **Vấn đề**:
  - Cột "Khách hàng" hiển thị `deal.customer_id` (số)
  - Cột "Người phụ trách" hiển thị `deal.owner_id` (số)
  - Không JOIN với bảng customers/users để lấy tên
- **Hệ quả**: UX kém, user phải tự nhớ ID

---

### D. SETTINGS & USER MANAGEMENT

#### D1. KHÔNG THỂ TẠO NGƯỜI DÙNG MỚI
**Files**:
- `app/(dashboard)/settings/page.tsx` dòng 191-193 (nút "Tạo người dùng")
- `app/api/users/route.ts` (chỉ có GET)
- **Vấn đề**:
  - Nút **KHÔNG CÓ onClick handler**
  - API **KHÔNG CÓ POST method**
  - Password không được hash trước khi gửi
- **Hệ quả**: Admin không thể thêm nhân viên mới

#### D2. KHÔNG THỂ SỬA/XÓA USER
**File**: `app/(dashboard)/settings/page.tsx` dòng 238-247
- **Vấn đề**: Tương tự các module khác
- **Hệ quả**: Không thể deactivate nhân viên nghỉ việc, đổi role

#### D3. Tab "Phân quyền" - CHỈ HIỂN THỊ, KHÔNG TƯƠNG TÁC
**File**: `app/(dashboard)/settings/page.tsx` dòng 256-295
- **Vấn đề**:
  - Permission matrix là static table
  - Không có UI để thay đổi permissions
  - Permissions hard-coded theo role, không customizable
- **Hệ quả**: RBAC cứng nhắc, không linh hoạt

#### D4. Integrations - HOÀN TOÀN GIẢ LẬP
**File**: `app/(dashboard)/settings/page.tsx` dòng 59-77
- **Vấn đề**:
  - Google Calendar, Slack, Zapier - chỉ là UI
  - Status "connected"/"disconnected" - hard-coded
  - Không có OAuth flow, webhook, hoặc API integration nào
- **Hệ quả**: Feature giả, gây hiểu lầm về khả năng hệ thống

#### D5. Tags management - MOCK DATA
**File**: `app/(dashboard)/settings/page.tsx` dòng 51-57
- **Vấn đề**:
  - Danh sách tags hard-coded
  - `count: 12, 8, 25...` không query từ DB
  - Không match với tags thực tế trong customers table
  - Tab "Thẻ & Nhãn" có thể không tồn tại hoặc không hoạt động
- **Hệ quả**: Tag management không khả dụng

---

### E. DATA MODEL & MOCK DATA

#### E1. Tags lưu dạng comma-separated string
**Schema**: `customers.tags NVARCHAR(500)`
- **Vấn đề**:
  - Lưu: `"VIP,Hot,Warm"` thay vì relational table
  - Không thể query: "Tìm tất cả customers có tag VIP"
  - Không thể aggregate: "Đếm số customers theo tag"
  - Không có validation - user có thể nhập bất kỳ text nào
- **Hệ quả**: Feature tags không scalable, không queryable

#### E2. Tag colors hard-coded trong frontend
**File**: `app/(dashboard)/customers/page.tsx` dòng 38-51
- **Vấn đề**:
  - 10 tags có màu định sẵn
  - Tags khác (như "Khách hàng thân thiết", "Tiềm năng" từ sample data) → màu default xám
  - Không match 1:1 với tags trong database
- **Hệ quả**: UI inconsistent

#### E3. Stages không có trong database
**File**: `app/(dashboard)/deals/page.tsx` dòng 52-58
- **Vấn đề**:
  - 6 stages hard-coded: Đăng ký, prospect, demo, proposal, won, lost
  - Database có thêm stage "negotiation" trong sample data
  - Không có bảng `stages` để quản lý
- **Hệ quả**: Không thể thêm/sửa/xóa stages khi quy trình bán hàng thay đổi

#### E4. API routes thiếu methods
**Files**: `app/api/customers/route.ts`, `app/api/deals/route.ts`, `app/api/users/route.ts`
- **Vấn đề**:
  - Tất cả chỉ có `GET` method
  - Không có `POST` (create)
  - Không có `PUT/PATCH` (update)
  - Không có `DELETE` (delete)
- **Hệ quả**: Backend không hỗ trợ bất kỳ write operation nào

#### E5. Không có API cho Activities và Reminders
**Files**: Kiểm tra `app/api/`
- **Vấn đề**:
  - Activities chỉ có GET, không tạo được hoạt động mới
  - Reminders hoàn toàn không có API route
- **Hệ quả**: 2 features quan trọng của CRM không hoạt động

#### E6. Type definitions thiếu
**File**: `app/(dashboard)/deals/page.tsx` dòng 35
- **Vấn đề**: `const [deals, setDeals] = useState<Deal[]>([])` - `Deal` type không được định nghĩa
- **Hệ quả**: TypeScript có thể báo lỗi, IDE autocomplete không hoạt động

---

## 3. PHÂN LOẠI MỨC ĐỘ NGHIÊM TRỌNG

### 🔴 CRITICAL - Làm sai dữ liệu / Sai quyết định
| ID | Vấn đề | Lý do Critical |
|----|--------|----------------|
| A3 | KPI "Doanh thu dự kiến" tính sai | Manager dựa vào số này để forecast, lập budget → Quyết định sai |
| A5 | "Doanh thu theo tháng" dựa trên expected_close_date | Báo cáo tài chính sai, không phản ánh tiền thực thu |
| A1-A4 | Tất cả % changes hard-coded | Trend analysis sai hoàn toàn |
| C7 | Stage-Probability không validate | Dữ liệu deals không đáng tin cậy |

### 🟠 BLOCKING - Không thao tác được
| ID | Vấn đề | Lý do Blocking |
|----|--------|----------------|
| B1 | Không tạo được customer | Chức năng cốt lõi CRM |
| C1 | Không tạo được deal | Chức năng cốt lõi CRM |
| D1 | Không tạo được user | Admin không thể onboard nhân viên |
| B2-B3 | Không sửa/xóa customer | CRUD không hoàn chỉnh |
| C5-C6 | Không sửa/xóa deal | Pipeline bị đóng băng |

### 🟡 DEGRADING - Làm mất giá trị sử dụng
| ID | Vấn đề | Lý do Degrading |
|----|--------|-----------------|
| A2 | "Cơ hội mở" đếm tất cả deals | Metric không có ý nghĩa |
| A6-A7 | Deals page KPIs hard-coded | UI không phản ánh thực tế |
| C2-C3 | Dropdowns hard-coded | Không liên kết được với data thật |
| C8 | Hiển thị ID thay vì tên | UX kém |
| E1 | Tags comma-separated | Không query được |
| D4 | Integrations giả lập | Gây hiểu lầm về capabilities |

### ⚪ COSMETIC - Chỉ ảnh hưởng UI
| ID | Vấn đề | Note |
|----|--------|------|
| E2 | Tag colors không match | Một số tags hiển thị màu xám |
| E6 | Type definitions thiếu | Có thể gây warning nhưng app vẫn chạy |
| B5 | "Gói giao dịch" trong customer form | UX confusing nhưng không blocking |

---

## 4. NHẬN XÉT TỔNG HỢP

### 4.1. Rủi ro nếu demo hiện tại

| Scenario | Rủi ro | Mức độ |
|----------|--------|--------|
| Demo chỉ xem data | Ổn, nhưng không ấn tượng | Thấp |
| Người xem yêu cầu "thêm 1 customer" | **FAIL ngay lập tức** | Rất cao |
| Người xem hỏi "68% thành công tính thế nào?" | Không trả lời được | Cao |
| Người xem hỏi "+12% so với tháng nào?" | Không trả lời được | Cao |
| Người xem click "Xem chi tiết" deal | **Có thể lỗi** | Trung bình |

### 4.2. Nếu không sửa - Hệ thống "chết" ở tầng nào

```
┌─────────────────────────────────────────────────────────────┐
│  STRATEGIC LEVEL - Cấp chiến lược                          │
│  ❌ Forecast sai → Quyết định đầu tư, tuyển dụng sai       │
│  ❌ Trend analysis sai → Không nhận ra vấn đề kịp thời     │
└─────────────────────────────────────────────────────────────┘
                              ↑
                        Dữ liệu sai
                              ↑
┌─────────────────────────────────────────────────────────────┐
│  MANAGERIAL LEVEL - Cấp quản lý                             │
│  ⚠️ KPI hiển thị sai → Đánh giá performance sai             │
│  ⚠️ Pipeline không cập nhật → Không biết team đang làm gì  │
└─────────────────────────────────────────────────────────────┘
                              ↑
                     Không có dữ liệu mới
                              ↑
┌─────────────────────────────────────────────────────────────┐
│  OPERATIONAL LEVEL - Cấp tác nghiệp                         │
│  🔴 KHÔNG THỂ NHẬP DỮ LIỆU → Hệ thống vô dụng               │
│  🔴 CRUD không hoạt động → Sales bỏ dùng, quay lại Excel   │
└─────────────────────────────────────────────────────────────┘
```

**Kết luận**: Hệ thống chết từ tầng **Operational** → lan lên tất cả các tầng. Không có dữ liệu mới → KPI đóng băng → Quyết định dựa trên dữ liệu cũ/sai.

### 4.3. Số lượng vấn đề tổng hợp

| Phân loại | Số lượng | % |
|-----------|----------|---|
| 🔴 Critical | 4 | 14% |
| 🟠 Blocking | 7 | 25% |
| 🟡 Degrading | 8 | 29% |
| ⚪ Cosmetic | 4 | 14% |
| Data Model issues | 5 | 18% |
| **TỔNG** | **28** | 100% |

### 4.4. Root Cause Analysis

**Nguyên nhân gốc rễ**:
1. **Frontend-first development**: UI hoàn thiện trước, backend chưa implement
2. **API routes incomplete**: Chỉ viết GET để hiển thị, quên POST/PUT/DELETE
3. **Form không có state management**: Inputs không bind với state variables
4. **Hard-coding để demo nhanh**: Các giá trị mock chưa được thay thế
5. **Thiếu integration testing**: Không ai test end-to-end flow

---

## 5. DEPENDENCY MAP

```
Để tạo được DEAL mới:
├── Cần API POST /api/deals (chưa có)
├── Cần dropdown Customers từ DB (hiện hard-coded)
│   └── Cần API GET /api/customers (có rồi)
├── Cần dropdown Users từ DB (hiện hard-coded)
│   └── Cần API GET /api/users (có rồi)
└── Cần form state management (chưa có)

Để KPI "Doanh thu dự kiến" đúng:
├── Cần fix công thức: weighted revenue = SUM(value * probability / 100)
├── Chỉ tính deals đang mở (không won/lost)
└── Cần deals data chính xác
    └── Cần CRUD deals hoạt động

Để Tags hoạt động đúng:
├── Option A: Migrate sang relational model (tags table + customer_tags)
└── Option B: Query parse comma-separated (phức tạp, không recommend)
```

---

**Ghi chú**: File này chỉ NHẬN DIỆN vấn đề. Giải pháp chi tiết sẽ được lập trong Phase 2 (Fix_Plan.md) sau khi được duyệt.

**Người phân tích**: Senior Product Engineer + MIS Consultant  
**Version**: 1.0  
**Ngày tạo**: 12/01/2026
