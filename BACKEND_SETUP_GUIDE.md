# 🚀 Backend Setup Guide - แก้ไข Error "Unexpected token '<'"

## ⚠️ **ปัญหาที่พบ:**

```
เกิดข้อผิดพลาด
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**สาเหตุ:** Backend server ยังไม่ได้เปิด หรือ API URL ไม่ถูกต้อง

---

## ✅ **วิธีแก้ไข (ทำตามลำดับ):**

### **ขั้นตอนที่ 1: สร้างไฟล์ .env**

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```bash
# คัดลอกจาก .env.example
cp .env.example .env
```

หรือสร้างไฟล์ `.env` ด้วยตัวเอง:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

### **ขั้นตอนที่ 2: ติดตั้ง Backend Dependencies**

```bash
cd backend
npm install
```

**Dependencies ที่จะติดตั้ง:**
- next
- @prisma/client
- prisma
- และอื่นๆ ตาม package.json

---

### **ขั้นตอนที่ 3: Setup Prisma**

```bash
# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init
```

---

### **ขั้นตอนที่ 4: Setup Database**

**Option 1: ใช้ PostgreSQL (แนะนำ)**

1. ติดตั้ง PostgreSQL
2. สร้าง database:
```sql
CREATE DATABASE lottery;
```

3. สร้างไฟล์ `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/lottery"
```

**Option 2: ใช้ SQLite (สำหรับทดสอบ)**

ในไฟล์ `backend/.env`:
```env
DATABASE_URL="file:./dev.db"
```

---

### **ขั้นตอนที่ 5: เริ่ม Backend Server**

```bash
cd backend
npm run dev
```

**ควรเห็น:**
```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
```

---

### **ขั้นตอนที่ 6: เริ่ม Frontend**

เปิด Terminal ใหม่:

```bash
npm run dev
```

---

## 🔍 **ตรวจสอบว่า Backend ทำงาน:**

เปิดเบราว์เซอร์ไปที่:
```
http://localhost:3000/api/dashboard/health
```

**ควรได้:**
```json
{
  "bankingApi": "online",
  "lottoApi": "online",
  "database": "online",
  "lastCheck": "2026-02-04T13:45:00.000Z"
}
```

---

## ⚠️ **Error ที่อาจพบ:**

### **1. "Cannot find module 'next/server'"**
**แก้:** รัน `npm install` ใน backend folder

### **2. "Cannot find module '@prisma/client'"**
**แก้:** รัน `npx prisma generate` ใน backend folder

### **3. "Database connection failed"**
**แก้:** ตรวจสอบ DATABASE_URL ใน backend/.env

### **4. "Port 3000 already in use"**
**แก้:** ปิดโปรแกรมที่ใช้ port 3000 หรือเปลี่ยน port

---

## 📁 **โครงสร้างไฟล์ที่ต้องมี:**

```
ppetch/
├── .env                          ← สร้างไฟล์นี้
│   └── VITE_API_BASE_URL=http://localhost:3000/api
│
├── backend/
│   ├── .env                      ← สร้างไฟล์นี้
│   │   └── DATABASE_URL=...
│   ├── package.json              ✅ มีอยู่แล้ว
│   ├── prisma/
│   │   └── schema.prisma         ✅ มีอยู่แล้ว
│   └── src/
│       └── app/api/              ✅ มีอยู่แล้ว (31 endpoints)
│
└── src/
    └── services/
        └── api.ts                ✅ แก้ไขแล้ว (error handling ดีขึ้น)
```

---

## 🎯 **Quick Start (สำหรับคนรีบ):**

```bash
# 1. สร้าง .env ในโฟลเดอร์หลัก
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# 2. ติดตั้ง backend
cd backend
npm install
npx prisma generate

# 3. สร้าง database (SQLite)
echo 'DATABASE_URL="file:./dev.db"' > .env
npx prisma migrate dev --name init

# 4. เริ่ม backend
npm run dev

# 5. เปิด Terminal ใหม่ - เริ่ม frontend
cd ..
npm run dev
```

---

## ✅ **ตรวจสอบว่าทำงานแล้ว:**

1. ✅ Backend running ที่ http://localhost:3000
2. ✅ Frontend running ที่ http://localhost:5173
3. ✅ เปิดหน้า Dashboard ไม่มี error
4. ✅ ข้อมูลโหลดได้ (อาจว่างเปล่าถ้ายังไม่มีข้อมูล)

---

## 🆘 **ยังมีปัญหา?**

### **Error: "Backend server is not running"**
→ Backend ยังไม่เปิด ให้รัน `npm run dev` ใน backend folder

### **Error: "Cannot connect to backend server"**
→ ตรวจสอบ URL ในไฟล์ `.env` ว่าถูกต้อง

### **Error: "Database connection failed"**
→ ตรวจสอบ DATABASE_URL ใน `backend/.env`

### **หน้าว่างเปล่า (ไม่มีข้อมูล)**
→ ปกติ! เพราะยังไม่มีข้อมูลใน database
→ ลองสร้างงวดหวยหรือเพิ่มสมาชิกทดสอบ

---

## 📝 **หมายเหตุ:**

- ✅ API Service แก้ไขแล้ว - จะแสดง error message ที่เข้าใจง่ายขึ้น
- ✅ ถ้าเห็น "Backend server is not running" แสดงว่าต้องเปิด backend
- ✅ ถ้าเห็น "Cannot connect" แสดงว่า URL ไม่ถูกต้อง

---

**พร้อมใช้งานแล้ว! 🚀**
