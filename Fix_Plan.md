# FIX PLAN - HỆ THỐNG CRM
## Phase 2: Kế hoạch Sửa chữa Hệ thống

**Dự án**: CRM - Customer Relationship Management  
**Tham chiếu**: Issues_Brainstorm.md (đã duyệt)  
**Ngày lập**: 12/01/2026  
**Vai trò**: Senior Product Engineer + MIS Consultant

---

## 1. NGUYÊN TẮC SỬA HỆ THỐNG

### 1.1. Thứ tự ưu tiên

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: BLOCKING → Khôi phục chức năng cốt lõi           │
│  • Không nhập được dữ liệu = Hệ thống vô dụng               │
│  • Phải sửa TRƯỚC khi làm bất kỳ thứ gì khác               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: CRITICAL → Sửa logic nghiệp vụ                   │
│  • KPI tính sai = Quyết định sai                           │
│  • Phải sửa để demo có giá trị thật                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: DEGRADING → Hoàn thiện trải nghiệm              │
│  • Dropdowns, hiển thị tên, view/edit/delete               │
│  • Sửa để hệ thống dùng được trong thực tế                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: COSMETIC → Cleanup cho demo                      │
│  • Xóa mock data, polish UI                                │
│  • Sửa cuối cùng trước khi demo                            │
└─────────────────────────────────────────────────────────────┘
```

### 1.2. Những thứ KHÔNG LÀM trong kế hoạch này

| Không làm | Lý do | Tham chiếu |
|-----------|-------|------------|
| Integrations thật (Google Calendar, Slack, Zapier) | Ngoài scope, cần OAuth/API keys | D4 |
| Tạo table `tags` riêng | Refactor lớn, có thể làm sau | E1 |
| Tạo table `stages` riêng | Refactor lớn, có thể làm sau | E3 |
| UI redesign | Không cần thiết, UI hiện tại đủ tốt | - |
| Reminders feature | Chưa có trong Issues_Brainstorm | E5 (partial) |
| Mobile responsive fixes | Cosmetic, không ảnh hưởng demo | - |

### 1.3. Nguyên tắc triển khai

1. **Sửa Backend trước, Frontend sau**: API route → Form handler → UI binding
2. **Test ngay sau mỗi fix**: Không đợi xong hết rồi test
3. **Commit thường xuyên**: Mỗi issue fix xong = 1 commit
4. **Không refactor structure**: Giữ nguyên file structure hiện tại

---

## 2. ROADMAP SỬA THEO PHASE

---

### PHASE 1 – KHÔI PHỤC CHỨC NĂNG CỐT LÕI (BLOCKING)

**Mục tiêu**: Hệ thống có thể CREATE/UPDATE/DELETE dữ liệu

**Thời gian ước tính**: 4-6 giờ

**Issues cần xử lý**:

#### 1.1. API Routes - Thêm POST/PUT/DELETE methods

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T1.1.1 | B1, E4 | Thêm POST method cho customers | `app/api/customers/route.ts` |
| T1.1.2 | B2, E4 | Thêm PUT method cho customers | `app/api/customers/[id]/route.ts` |
| T1.1.3 | B3, E4 | Thêm DELETE method cho customers | `app/api/customers/[id]/route.ts` |
| T1.1.4 | C1, E4 | Thêm POST method cho deals | `app/api/deals/route.ts` |
| T1.1.5 | C5, E4 | Thêm PUT method cho deals | `app/api/deals/[id]/route.ts` (tạo mới) |
| T1.1.6 | C6, E4 | Thêm DELETE method cho deals | `app/api/deals/[id]/route.ts` |
| T1.1.7 | D1, E4 | Thêm POST method cho users | `app/api/users/route.ts` |
| T1.1.8 | D2, E4 | Thêm PUT/DELETE methods cho users | `app/api/users/[id]/route.ts` (tạo mới) |
| T1.1.9 | D1 (Security) | **Hash password server-side** với bcrypt trong POST /api/users. KHÔNG hash ở client. | `app/api/users/route.ts` |

#### 1.2. Form State Management - Bind inputs với state

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T1.2.1 | B1 | Customer form: useState cho tất cả fields | `app/(dashboard)/customers/page.tsx` |
| T1.2.2 | B1 | Customer form: onChange handlers | `app/(dashboard)/customers/page.tsx` |
| T1.2.3 | C1 | Deal form: useState cho tất cả fields | `app/(dashboard)/deals/page.tsx` |
| T1.2.4 | C1 | Deal form: onChange handlers | `app/(dashboard)/deals/page.tsx` |
| T1.2.5 | D1 | User form: useState cho tất cả fields | `app/(dashboard)/settings/page.tsx` |
| T1.2.6 | D1 | User form: onChange handlers | `app/(dashboard)/settings/page.tsx` |

#### 1.3. Submit Handlers - Connect forms với APIs

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T1.3.1 | B1 | Customer: handleSubmit gọi POST API | `app/(dashboard)/customers/page.tsx` |
| T1.3.2 | C1 | Deal: handleSubmit gọi POST API | `app/(dashboard)/deals/page.tsx` |
| T1.3.3 | D1 | User: handleSubmit gọi POST API | `app/(dashboard)/settings/page.tsx` |
| T1.3.4 | B1, C1, D1 | Refresh data sau khi submit thành công | Tất cả 3 files |
| T1.3.5 | B1, C1, D1 | Đóng dialog sau khi submit thành công | Tất cả 3 files |

**Kết quả mong đợi sau Phase 1**:
- [ ] Có thể tạo mới Customer từ form
- [ ] Có thể tạo mới Deal từ form
- [ ] Có thể tạo mới User từ form (Admin)
- [ ] Data tự động refresh sau khi tạo
- [ ] Dialog tự động đóng sau khi submit

**Acceptance Test Phase 1**:
1. Mở `/customers` → Click "Thêm khách hàng" → Nhập data → Lưu → Customer xuất hiện trong table
2. Mở `/deals` → Click "Tạo cơ hội mới" → Nhập data → Lưu → Deal xuất hiện trong table
3. Mở `/settings` → Click "Thêm người dùng" → Nhập data → Lưu → User xuất hiện trong table

---

### PHASE 2 – SỬA DỮ LIỆU & LOGIC NGHIỆP VỤ (CRITICAL)

**Mục tiêu**: KPI và metrics hiển thị chính xác, phản ánh đúng nghiệp vụ

**Thời gian ước tính**: 3-4 giờ

**Điều kiện tiên quyết**: Phase 1 hoàn thành VÀ pass 3 acceptance tests:
- ✅ Create customer OK (TC03-A)
- ✅ Create deal OK (TC04-A)  
- ✅ Create user OK (TC06-A, nếu demo cần)

**Issues cần xử lý**:

#### 2.1. Sửa KPI Dashboard

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T2.1.1 | A2 | "Cơ hội mở": Chỉ đếm deals có stage NOT IN ('won', 'lost') | `app/(dashboard)/dashboard/page.tsx` |
| T2.1.2 | A3 | "Doanh thu dự kiến": Tính weighted = SUM(value * probability / 100), chỉ deals đang mở | `app/(dashboard)/dashboard/page.tsx` |
| T2.1.3 | A4 | "Tỷ lệ thành công": Bỏ check 'thanhcong', chỉ dùng 'won' | `app/(dashboard)/dashboard/page.tsx` |
| T2.1.4 | A1, A2, A3, A4 | Tính % change thật: So sánh với tháng trước | `app/(dashboard)/dashboard/page.tsx` |
| T2.1.5 | A1, A2, A3, A4 | Tính trend (up/down) dựa trên % change thật | `app/(dashboard)/dashboard/page.tsx` |

#### 2.2. Sửa "Doanh thu theo tháng"

**⚠️ PHÂN BIỆT RÕ 2 LOẠI DOANH THU**:
| Metric | Dataset | Công thức | Ý nghĩa |
|--------|---------|-----------|----------|
| **Doanh thu theo tháng** | Deals đã WON với `actual_close_date` | SUM(value) WHERE stage='won' | Tiền THỰC ĐÃ THU |
| **Doanh thu dự kiến** (KPI) | Deals ĐANG MỞ (not won/lost) | SUM(value × probability/100) | Tiền KỲ VỌNG sẽ thu |

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T2.2.1 | A5 | Dựa trên actual_close_date thay vì expected_close_date | `app/(dashboard)/dashboard/page.tsx` |
| T2.2.2 | A5 | Chỉ tính deals đã won (có actual_close_date) | `app/(dashboard)/dashboard/page.tsx` |
| T2.2.3 | A5 | Sắp xếp đúng thứ tự thời gian | `app/(dashboard)/dashboard/page.tsx` |

**⚠️ SORT RULE BẮT BUỘC cho T2.2.3**:
- Sort by: `new Date(year, monthIndex)` hoặc numeric key `year * 100 + month`
- **CẤM** dùng `localeCompare()` trên string label (sai thứ tự)

#### 2.3. Sửa KPIs trang Deals

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T2.3.1 | A6 | "Tỷ lệ thành công 68%": Tính từ data thật | `app/(dashboard)/deals/page.tsx` |
| T2.3.2 | A7 | "Đến hạn: 3": Đếm deals có expected_close_date trong tuần này | `app/(dashboard)/deals/page.tsx` |

#### 2.4. Stage-Probability Validation

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T2.4.1 | C7 | Tạo stageProbabilityMap object | `app/(dashboard)/deals/page.tsx` |
| T2.4.2 | C7 | Auto-fill probability khi chọn stage | `app/(dashboard)/deals/page.tsx` |
| T2.4.3 | C7 | Cho phép user override nhưng hiển thị warning nếu không match | `app/(dashboard)/deals/page.tsx` |

**Kết quả mong đợi sau Phase 2**:
- [ ] KPI "Cơ hội mở" chỉ đếm deals đang trong pipeline
- [ ] KPI "Doanh thu dự kiến" = weighted revenue forecast
- [ ] % changes tính từ dữ liệu thật (so với tháng trước)
- [ ] Trend arrows (up/down) phản ánh đúng
- [ ] "Doanh thu theo tháng" hiển thị tiền thực đã thu
- [ ] Chọn stage → probability tự động suggest

**Acceptance Test Phase 2**:
1. Tạo 2 deals: 1 won (value=100M), 1 prospect (value=50M, prob=40%)
2. Dashboard "Doanh thu dự kiến" = 50M × 40% = 20M (không tính deal won)
3. "Doanh thu theo tháng" hiển thị 100M ở tháng hiện tại (từ deal won)
4. Khi chọn stage="won" → probability tự động = 100%

---

### PHASE 3 – HOÀN THIỆN LUỒNG SỬ DỤNG (DEGRADING)

**Mục tiêu**: UX hoàn chỉnh, dữ liệu hiển thị có ý nghĩa

**Thời gian ước tính**: 3-4 giờ

**Điều kiện tiên quyết**: Phase 2 hoàn thành

**Issues cần xử lý**:

#### 3.1. Fix Dropdowns → Combobox Searchable (Autocomplete)

**⚠️ QUAN TRỌNG**: Không dùng static dropdown. Phải dùng **Combobox searchable** (input + suggestions):
- Load full list nếu data nhỏ (<100 items)
- Fetch theo keyword nếu data lớn (>100 items)
- Cho phép user gõ để filter

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T3.1.1 | C2 | Deals form: **Combobox searchable** cho Khách hàng (fetch customers, filter theo input) | `app/(dashboard)/deals/page.tsx` |
| T3.1.2 | C3 | Deals form: **Combobox searchable** cho Người phụ trách (fetch users, filter theo input) | `app/(dashboard)/deals/page.tsx` |
| T3.1.3 | B5 | Customer form: Xóa dropdown "Gói giao dịch" (sai workflow) | `app/(dashboard)/customers/page.tsx` |

#### 3.2. Hiển thị Tên thay vì ID

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T3.2.1 | C8 | Deals table: JOIN customers để hiển thị customer_name | `app/api/deals/route.ts` hoặc frontend |
| T3.2.2 | C8 | Deals table: JOIN users để hiển thị owner_name | `app/api/deals/route.ts` hoặc frontend |

#### 3.3. Edit Flow - Customers

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T3.3.1 | B2 | Tạo Edit Dialog cho Customer | `app/(dashboard)/customers/page.tsx` |
| T3.3.2 | B2 | Populate form với data hiện tại khi click Edit | `app/(dashboard)/customers/page.tsx` |
| T3.3.3 | B2 | handleUpdate gọi PUT API | `app/(dashboard)/customers/page.tsx` |

#### 3.4. Edit Flow - Deals

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T3.4.1 | C5 | Tạo Edit Dialog cho Deal | `app/(dashboard)/deals/page.tsx` |
| T3.4.2 | C5 | Populate form với data hiện tại khi click Edit | `app/(dashboard)/deals/page.tsx` |
| T3.4.3 | C5 | handleUpdate gọi PUT API | `app/(dashboard)/deals/page.tsx` |

#### 3.5. Delete Flow

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T3.5.1 | B3 | Customer: Confirmation dialog trước khi xóa | `app/(dashboard)/customers/page.tsx` |
| T3.5.2 | B3 | Customer: handleDelete gọi DELETE API | `app/(dashboard)/customers/page.tsx` |
| T3.5.3 | C6 | Deal: Confirmation dialog + handleDelete | `app/(dashboard)/deals/page.tsx` |
| T3.5.4 | D2 | User: Confirmation dialog + handleDelete | `app/(dashboard)/settings/page.tsx` |

#### 3.6. View Detail Flow

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T3.6.1 | C4 | Tạo route `/deals/[id]/page.tsx` | `app/(dashboard)/deals/[id]/page.tsx` (tạo mới) |
| T3.6.2 | C4 | Tạo API `/api/deals/[id]` GET method | `app/api/deals/[id]/route.ts` |
| T3.6.3 | C4 | "Xem chi tiết" navigate đến `/deals/{id}` | `app/(dashboard)/deals/page.tsx` |

**Kết quả mong đợi sau Phase 3**:
- [ ] Dropdown "Khách hàng" hiển thị tên từ DB
- [ ] Dropdown "Người phụ trách" hiển thị tên từ DB
- [ ] Table Deals hiển thị tên khách hàng, tên người phụ trách (không ID)
- [ ] Click "Chỉnh sửa" → Mở form với data hiện tại
- [ ] Click "Xóa" → Confirmation → Xóa thành công
- [ ] Click "Xem chi tiết" (Deal) → Navigate đến detail page

**Acceptance Test Phase 3**:
1. Tạo deal mới → Dropdown khách hàng hiển thị tên từ DB
2. Trong table Deals → Cột "Khách hàng" hiển thị "Công ty ABC" thay vì "1"
3. Click Edit customer → Form pre-filled → Sửa tên → Lưu → Table cập nhật
4. Click Delete deal → Confirm → Deal biến mất khỏi table

---

### PHASE 4 – CLEANUP & DEMO READINESS (COSMETIC)

**Mục tiêu**: Xóa mock data, chuẩn bị sẵn sàng demo

**Thời gian ước tính**: 1-2 giờ

**Điều kiện tiên quyết**: Phase 3 hoàn thành

**Issues cần xử lý**:

#### 4.1. Xóa Mock Data

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T4.1.1 | D5 | Settings: Xóa hard-coded tags list, hoặc query từ DB | `app/(dashboard)/settings/page.tsx` |
| T4.1.2 | D4 | Settings: Đổi label Integrations thành **"Demo stub"** + tooltip **"Not implemented - for demonstration only"**. Tránh bị hỏi "kết nối thật chưa?" | `app/(dashboard)/settings/page.tsx` |
| T4.1.3 | E3 | Deals: Thêm stage "negotiation" vào stages array nếu có trong data | `app/(dashboard)/deals/page.tsx` |

#### 4.2. UI Polish

| Task ID | Issue Ref | Mô tả | File cần sửa |
|---------|-----------|-------|--------------|
| T4.2.1 | E2 | Thêm tag colors cho các tags trong sample data (Hot, Warm, Cold, etc.) | `app/(dashboard)/customers/page.tsx` |
| T4.2.2 | E6 | Định nghĩa Deal type interface | `app/(dashboard)/deals/page.tsx` |

#### 4.3. Demo Preparation

| Task ID | Issue Ref | Mô tả | Action |
|---------|-----------|-------|--------|
| T4.3.1 | - | Verify sample data đầy đủ | Chạy insert-sample-data.sql |
| T4.3.2 | - | Test login với 3 roles | Test nva@, ttb@, ptd@ |
| T4.3.3 | - | Chạy qua 6 Use Cases trong Demo_Test_UC.md | Manual test |
| T4.3.4 | - | Chuẩn bị tài khoản demo + data | Document |

**Kết quả mong đợi sau Phase 4**:
- [ ] Không còn hard-coded mock data hiển thị sai
- [ ] Tags hiển thị đúng màu
- [ ] Integrations được đánh dấu rõ ràng là placeholder
- [ ] Tất cả 6 Use Cases trong Demo_Test_UC.md PASS

**Acceptance Test Phase 4**:
1. Chạy qua Demo_Test_UC.md từ TC01-A đến TC06-B
2. Tất cả Happy Paths PASS
3. Exception cases hoạt động đúng (validation, error messages)

---

## 3. DEPENDENCY & THỨ TỰ TRIỂN KHAI

### 3.1. Dependency Graph

```
T1.1.1 (POST customers API)
    └── T1.2.1, T1.2.2 (Customer form state)
        └── T1.3.1 (Customer submit handler)
            └── T3.3.1-T3.3.3 (Customer edit flow)
                └── T3.5.1-T3.5.2 (Customer delete flow)

T1.1.4 (POST deals API)
    └── T1.2.3, T1.2.4 (Deal form state)
        └── T1.3.2 (Deal submit handler)
            └── T3.1.1, T3.1.2 (Dropdowns từ DB)
                └── T3.4.1-T3.4.3 (Deal edit flow)
                    └── T3.5.3 (Deal delete flow)

T2.1.1-T2.1.5 (KPI fixes)
    └── Không dependency, có thể làm song song với Phase 1

T3.2.1-T3.2.2 (Hiển thị tên thay ID)
    └── Phụ thuộc T3.1.1, T3.1.2 (cần fetch customers/users trước)
```

### 3.2. Thứ tự triển khai bắt buộc

**⚠️ ƯU TIÊN: Làm 1 module HOÀN CHỈNH trước khi chuyển module khác**

| Bước | Tasks | Lý do |
|------|-------|-------|
| 1 | **CUSTOMERS CRUD HOÀN CHỈNH** | Deals phụ thuộc Customers |
| 1.1 | T1.1.1, T1.1.2, T1.1.3 | API POST/PUT/DELETE customers |
| 1.2 | T1.2.1, T1.2.2 | Customer form state + onChange |
| 1.3 | T1.3.1, T1.3.4, T1.3.5 | Customer submit handler + refresh + close dialog |
| 1.4 | T3.3.1, T3.3.2, T3.3.3 | Customer edit flow |
| 1.5 | T3.5.1, T3.5.2 | Customer delete flow |
| 2 | **DEALS CRUD HOÀN CHỈNH** | Sau khi Customers xong |
| 2.1 | T1.1.4, T1.1.5, T1.1.6 | API POST/PUT/DELETE deals |
| 2.2 | T1.2.3, T1.2.4 | Deal form state + onChange |
| 2.3 | T1.3.2 | Deal submit handler |
| 2.4 | T3.1.1, T3.1.2, T3.1.3 | Combobox searchable cho dropdowns |
| 2.5 | T3.4.1, T3.4.2, T3.4.3 | Deal edit flow |
| 2.6 | T3.5.3 | Deal delete flow |
| 2.7 | T3.6.1, T3.6.2, T3.6.3 | Deal view detail |
| 3 | **USERS CRUD** | T1.1.7, T1.1.8, T1.2.5, T1.2.6, T1.3.3, T3.5.4, T1.1.9 |
| 4 | **KPI FIXES** | T2.1.1 → T2.4.3 (sau khi CRUD hoàn thành) |
| 5 | **CLEANUP** | T4.1.1 → T4.3.4 |

### 3.3. Tasks có thể làm song song

| Group A (Backend) | Group B (Frontend Logic) | Group C (KPI) |
|-------------------|-------------------------|---------------|
| T1.1.1-T1.1.8 | T1.2.1-T1.2.6 | T2.1.1-T2.4.3 |

**Lưu ý**: Group A phải xong trước khi làm T1.3.x (submit handlers cần API)

### 3.4. Tasks KHÔNG được làm song song

| Task 1 | Task 2 | Lý do |
|--------|--------|-------|
| T1.1.1 (POST API) | T1.3.1 (Submit handler) | Handler cần API sẵn sàng |
| T3.1.1 (Fetch customers) | T3.3.2 (Edit populate) | Edit cần dropdown data |
| T3.5.1 (Delete confirm) | T3.5.2 (Delete handler) | Confirm trước, handler sau |

---

## 4. TIÊU CHÍ HOÀN THÀNH (DEFINITION OF DONE)

### 4.1. "Xong để Demo" (Demo-Ready)

Hệ thống đạt mức Demo-Ready khi:

| # | Tiêu chí | Test Case | Pass? |
|---|----------|-----------|-------|
| 1 | Đăng nhập thành công với 3 roles | TC01-A | ☐ |
| 2 | Dashboard KPI hiển thị số liệu thật | TC02-A | ☐ |
| 3 | Tạo được Customer mới từ form | TC03-A | ☐ |
| 4 | Tạo được Deal mới từ form | TC04-A | ☐ |
| 5 | Xem chi tiết Customer với deals/activities | TC05-A | ☐ |
| 6 | Admin quản lý được users | TC06-A | ☐ |
| 7 | Không còn hard-coded KPI values | Visual check | ☐ |
| 8 | Dropdowns load data từ DB | Visual check | ☐ |

**Minimum Viable Demo**: Tiêu chí 1-6 PHẢI pass. Tiêu chí 7-8 nên pass.

### 4.2. "MIS Usable" (Production-Ready for MIS)

Hệ thống đạt mức MIS Usable khi thỏa mãn:

#### Operational Level ✓
- [ ] Sales có thể nhập Customer mới
- [ ] Sales có thể tạo Deal mới
- [ ] Sales có thể update stage của Deal
- [ ] Sales có thể log Activities (nếu có)

#### Managerial Level ✓
- [ ] Dashboard KPI phản ánh dữ liệu thật
- [ ] % changes tính từ dữ liệu thật
- [ ] Pipeline visualization chính xác
- [ ] Win rate tính đúng công thức

#### Strategic Level ✓
- [ ] Revenue forecast = weighted pipeline value
- [ ] Monthly revenue = actual closed deals
- [ ] Có thể export data (nếu có)

### 4.3. Checklist trước khi báo "DONE"

```
PRE-DEMO CHECKLIST:
☐ Tất cả 8 tasks Phase 1 hoàn thành
☐ Tất cả 12 tasks Phase 2 hoàn thành
☐ Tất cả 16 tasks Phase 3 hoàn thành
☐ Tất cả 6 tasks Phase 4 hoàn thành
☐ 6 Use Cases trong Demo_Test_UC.md PASS
☐ Không có console errors
☐ Sample data đã insert
☐ Server chạy ổn định > 10 phút
```

---

## 5. TỔNG HỢP TASKS

| Phase | Số Tasks | Mức độ | Thời gian |
|-------|----------|--------|-----------|
| Phase 1 | 17 | BLOCKING | 4-6 giờ |
| Phase 2 | 12 | CRITICAL | 3-4 giờ |
| Phase 3 | 16 | DEGRADING | 3-4 giờ |
| Phase 4 | 6 | COSMETIC | 1-2 giờ |
| **TỔNG** | **51** | - | **11-16 giờ** |

### Trace Matrix: Tasks → Issues

| Issue ID | Issue Description | Related Tasks |
|----------|-------------------|---------------|
| B1 | Không tạo được customer | T1.1.1, T1.2.1, T1.2.2, T1.3.1, T1.3.4, T1.3.5 |
| B2 | Không sửa được customer | T1.1.2, T3.3.1, T3.3.2, T3.3.3 |
| B3 | Không xóa được customer | T1.1.3, T3.5.1, T3.5.2 |
| B5 | "Gói giao dịch" sai workflow | T3.1.3 |
| C1 | Không tạo được deal | T1.1.4, T1.2.3, T1.2.4, T1.3.2 |
| C2 | Dropdown khách hàng hard-coded | T3.1.1 |
| C3 | Dropdown người phụ trách hard-coded | T3.1.2 |
| C4 | Không xem chi tiết deal | T3.6.1, T3.6.2, T3.6.3 |
| C5 | Không sửa được deal | T1.1.5, T3.4.1, T3.4.2, T3.4.3 |
| C6 | Không xóa được deal | T1.1.6, T3.5.3 |
| C7 | Stage-Probability không validate | T2.4.1, T2.4.2, T2.4.3 |
| C8 | Hiển thị ID thay vì tên | T3.2.1, T3.2.2 |
| D1 | Không tạo được user | T1.1.7, T1.2.5, T1.2.6, T1.3.3 |
| D2 | Không sửa/xóa user | T1.1.8, T3.5.4 |
| D4 | Integrations giả lập | T4.1.2 |
| D5 | Tags mock data | T4.1.1 |
| A1 | KPI % change hard-coded | T2.1.4, T2.1.5 |
| A2 | "Cơ hội mở" đếm sai | T2.1.1 |
| A3 | "Doanh thu dự kiến" tính sai | T2.1.2 |
| A4 | "Tỷ lệ thành công" check sai | T2.1.3 |
| A5 | "Doanh thu theo tháng" logic sai | T2.2.1, T2.2.2, T2.2.3 |
| A6 | Deals page "68%" hard-coded | T2.3.1 |
| A7 | Deals page "3" hard-coded | T2.3.2 |
| E2 | Tag colors không match | T4.2.1 |
| E3 | Stage "negotiation" thiếu | T4.1.3 |
| E4 | API thiếu methods | T1.1.1-T1.1.8 |
| E6 | Deal type thiếu | T4.2.2 |

---

**Lưu ý cuối**: Plan này KHÔNG bao gồm việc viết code. Đây là tài liệu hướng dẫn để triển khai. Khi bắt đầu code, follow từng Task theo thứ tự đã định.

**Người lập kế hoạch**: Senior Product Engineer + MIS Consultant  
**Version**: 1.0  
**Ngày tạo**: 12/01/2026  
**Tham chiếu**: Issues_Brainstorm.md v1.0
