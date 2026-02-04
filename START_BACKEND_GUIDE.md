# 🚀 วิธีเริ่ม Backend Server (แก้ไข Error)

## ⚠️ **Error ที่พบ:**
```
Backend server is not running. Please start the backend server at http://localhost:3001
```

---

## ✅ **ขั้นตอนแก้ไข (เลือก 1 ใน 2 วิธี):**

---

## 🎯 **วิธีที่ 1: ใช้ SQLite (แนะนำ - ง่ายที่สุด)**

### **ขั้นตอนที่ 1: แก้ไข Prisma Schema**

เปิดไฟล์ `backend/prisma/schema.prisma` แก้บรรทัดที่ 8-11:

**จาก:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**เป็น:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### **ขั้นตอนที่ 2: สร้างไฟล์ .env**

สร้างไฟล์ `backend/.env`:
```env
DATABASE_URL="file:./dev.db"
```

### **ขั้นตอนที่ 3: Generate และ Migrate**

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### **ขั้นตอนที่ 4: เริ่ม Backend**

```bash
npm run dev
```

**ควรเห็น:**
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

### **ขั้นตอนที่ 5: เปลี่ยน Port เป็น 3001**

ถ้า backend รันที่ port 3000 แต่ต้องการ 3001:

สร้างไฟล์ `backend/next.config.js`:
```js
module.exports = {
  env: {
    PORT: 3001
  }
}
```

หรือรันด้วย:
```bash
$env:PORT=3001; npm run dev
```

---

## 🐘 **วิธีที่ 2: ใช้ PostgreSQL (สำหรับ Production)**

### **ขั้นตอนที่ 1: ติดตั้ง PostgreSQL**

1. ดาวน์โหลด PostgreSQL: https://www.postgresql.org/download/
2. ติดตั้งและจดจำ username/password

### **ขั้นตอนที่ 2: สร้าง Database**

เปิด pgAdmin หรือ psql:
```sql
CREATE DATABASE lottery;
```

### **ขั้นตอนที่ 3: สร้างไฟล์ .env**

สร้างไฟล์ `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/lottery"
```

**เปลี่ยน:**
- `postgres` = username ของคุณ
- `your_password` = password ของคุณ
- `lottery` = ชื่อ database

### **ขั้นตอนที่ 4: Generate และ Migrate**

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### **ขั้นตอนที่ 5: เริ่ม Backend**

```bash
npm run dev
```

---

## 🔍 **ตรวจสอบว่าทำงาน:**

### **1. ตรวจสอบ Backend:**
เปิดเบราว์เซอร์:
```
http://localhost:3001/api/dashboard/health
```

**ควรได้:**
```json
{
  "bankingApi": "online",
  "lottoApi": "online",
  "database": "online",
  "lastCheck": "2026-02-04T14:08:00.000Z"
}
```

### **2. ตรวจสอบ Frontend:**
Refresh หน้าเว็บ - Error ควรหายไป

---

## 📝 **สรุปคำสั่งด่วน (SQLite):**

```bash
# 1. ไปที่ backend folder
cd backend

# 2. แก้ไข prisma/schema.prisma (เปลี่ยน postgresql เป็น sqlite)

# 3. สร้าง .env
echo 'DATABASE_URL="file:./dev.db"' > .env

# 4. Generate Prisma
npx prisma generate

# 5. Migrate Database
npx prisma migrate dev --name init

# 6. เริ่ม Server (port 3001)
$env:PORT=3001; npm run dev
```

---

## ⚠️ **Error ที่อาจพบ:**

### **"Port 3001 is already in use"**
**แก้:** ปิดโปรแกรมที่ใช้ port 3001 หรือใช้ port อื่น

### **"Database connection failed"**
**แก้:** ตรวจสอบ DATABASE_URL ในไฟล์ `.env`

### **"Cannot find module 'next'"**
**แก้:** รัน `npm install` ใน backend folder

### **"Prisma Client not found"**
**แก้:** รัน `npx prisma generate`

---

## 🎯 **ขั้นตอนสำหรับคนรีบ:**

**ใช้ SQLite (ไม่ต้องติดตั้งอะไรเพิ่ม):**

1. แก้ `backend/prisma/schema.prisma` เปลี่ยน `postgresql` → `sqlite`
2. สร้าง `backend/.env` ใส่ `DATABASE_URL="file:./dev.db"`
3. รัน `cd backend`
4. รัน `npx prisma generate`
5. รัน `npx prisma migrate dev --name init`
6. รัน `$env:PORT=3001; npm run dev`
7. Refresh หน้าเว็บ

---

## ✅ **เสร็จแล้ว!**

Backend ควรรันที่ http://localhost:3001 และ Frontend จะเชื่อมต่อได้แล้ว! 🚀
