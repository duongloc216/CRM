# CRM Customer Management System

He thong CRM duoc xay dung bang Next.js (App Router), TypeScript va Microsoft SQL Server.

## Tong quan

Ung dung cung cap cac module:
- Dang nhap nguoi dung
- Dashboard KPI ban hang
- Quan ly khach hang (CRUD)
- Quan ly co hoi/giao dich (CRUD)
- Bao cao + xuat Excel/CSV
- Quan tri nguoi dung va phan quyen co ban

## Cong nghe

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS + Radix UI (shadcn-style components)
- Microsoft SQL Server (`mssql`)
- `bcryptjs` cho xu ly mat khau
- `xlsx` cho export du lieu

## Cau truc thu muc chinh

- `app/`: App Router pages va API routes
- `app/api/`: Backend API handlers
- `components/`: UI va layout components
- `hooks/`: React hooks dung trong app
- `lib/`: Ket noi DB va helper response
- `scripts/`: SQL/Python/JS scripts de tao va nap du lieu
- `styles/`, `app/globals.css`: style toan cuc

## Luong chuc nang

1. Nguoi dung dang nhap tai `/login` (goi `POST /api/auth/login`).
2. Token duoc luu trong `localStorage`.
3. `AuthGuard` bao ve nhom route dashboard (`/(dashboard)`).
4. Cac man hinh goi API de doc/ghi du lieu SQL Server.

## API chinh

### Auth
- `POST /api/auth/login`: Dang nhap bang email/password.

### Customers
- `GET /api/customers`: Lay danh sach khach hang.
- `POST /api/customers`: Tao khach hang.
- `GET /api/customers/:id`: Lay chi tiet khach hang + deals + activities lien quan.
- `PUT /api/customers/:id`: Cap nhat khach hang.
- `DELETE /api/customers/:id`: Xoa khach hang (co rang buoc lien quan deals).

### Deals
- `GET /api/deals`: Lay danh sach deals (join customer + owner).
- `POST /api/deals`: Tao deal.
- `GET /api/deals/:id`: Lay chi tiet deal + activities.
- `PUT /api/deals/:id`: Cap nhat deal.
- `DELETE /api/deals/:id`: Xoa deal.

### Users
- `GET /api/users`: Lay danh sach users.
- `POST /api/users`: Tao user moi (hash password).
- `GET /api/users/:id`: Lay chi tiet user.
- `PUT /api/users/:id`: Cap nhat user (co ho tro doi password).
- `DELETE /api/users/:id`: Xoa user (co check rang buoc ownership).

### Khac
- `GET /api/activities`: Lay lich su hoat dong.
- `GET /api/health`: Kiem tra ket noi DB.
- `GET /api/db-schema`: Kiem tra schema cac bang chinh.
- `GET /api/customers-with-deal`: Endpoint tong hop customer/deal (dang ton tai trong codebase).

## Database

Project dung SQL Server voi cac bang/chuc nang chinh:
- `users`
- `customers`
- `deals`
- `activities`
- `reminders`

Scripts tao schema va seed du lieu nam trong `scripts/`:
- `create-database.sql`
- `insert-sample-data.sql`
- `reset-database.sql`
- `update-password-hashes.sql`

## Bien moi truong

Tao file `.env` (tham khao gia tri mac dinh trong `lib/db.ts`):

```env
DB_USER=sa
DB_PASSWORD=your_password
DB_SERVER=localhost\\SQLEXPRESS
DB_NAME=CustomerManagement
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

## Cai dat va chay local

1. Cai dependencies:

```bash
pnpm install
```

2. Tao database/schema va seed data:
- Chay cac script SQL trong thu muc `scripts/` (uu tien `create-database.sql`, sau do `insert-sample-data.sql`).

3. Chay dev server:

```bash
pnpm dev
```

4. Mo trinh duyet tai:
- `http://localhost:3000`

## Tai khoan demo

Theo UI dang nhap hien tai:
- Admin: `nva@example.com / admin123`
- Sales: `ttb@example.com / sales123`

Luu y: can dam bao password hash trong DB da duoc cap nhat tu scripts lien quan.

## Luu y ky thuat

- `next.config.mjs` dang bo qua loi ESLint/TypeScript khi build (`ignoreDuringBuilds`, `ignoreBuildErrors`).
- Xac thuc hien tai dua vao token luu `localStorage` va kiem tra o client-side guard.
- API dang su dung connection pool thong qua `lib/db.ts`.

## Script co san trong package.json

- `pnpm dev`: Chay development server
- `pnpm build`: Build production
- `pnpm start`: Chay production server
- `pnpm lint`: Lint

## Ghi chu ve cleanup

Codebase da duoc don dep cac file khong can thiet:
- Xoa duplicate hooks trong `components/ui/` (da trung voi `hooks/`).
- Xoa cac JSON dump/debug khong duoc su dung trong runtime.

README nay duoc viet lai dua tren codebase hien tai.
