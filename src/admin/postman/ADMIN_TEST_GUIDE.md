# Admin Module — Postman Test Guide

Base URL: `http://localhost:3000`

> **Important:** Routes 3–15 require `Authorization: Bearer <token>` header. Get the token from the login route first.

---

## Auth Routes (no token needed)

### 1. Register Admin
```bash
curl -X POST http://localhost:3000/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fittrack.com",
    "password": "Admin123",
    "fullName": "Super Admin",
    "phone": "01711223344",
    "country": "Bangladesh"
  }'
```
✅ Success `201`
```json
{
  "message": "Admin registered successfully",
  "id": "ADM-123456",
  "email": "admin@fittrack.com"
}
```
❌ Duplicate email `409`
```json
{ "message": "Email already registered", "statusCode": 409 }
```
❌ Weak password `400`
```json
{ "message": ["Password must contain at least one uppercase and one lowercase letter"], "statusCode": 400 }
```

---

### 2. Login
```bash
curl -X POST http://localhost:3000/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fittrack.com",
    "password": "Admin123"
  }'
```
✅ Success `200` — copy the `access_token`
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "ADM-123456",
  "email": "admin@fittrack.com"
}
```
❌ Wrong password `401`
```json
{ "message": "Invalid email or password", "statusCode": 401 }
```

---

## Profile Routes (One to One relationship)

### 3. Get Own Profile
```bash
curl -X GET http://localhost:3000/admin/profile \
  -H "Authorization: Bearer <token>"
```
✅ Success `200`
```json
{
  "id": "ADM-123456",
  "email": "admin@fittrack.com",
  "isActive": true,
  "createdAt": "2026-07-01T00:00:00.000Z",
  "profile": {
    "id": 1,
    "fullName": "Super Admin",
    "phone": "01711223344",
    "country": "Bangladesh"
  }
}
```
❌ No token `401`
```json
{ "message": "Access denied — valid JWT token required", "statusCode": 401 }
```

---

### 4. Update Own Profile
```bash
curl -X PUT http://localhost:3000/admin/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Admin",
    "phone": "01999888777",
    "country": "Bangladesh"
  }'
```
✅ Success `200`
```json
{
  "id": 1,
  "fullName": "Updated Admin",
  "phone": "01999888777",
  "country": "Bangladesh"
}
```

---

## Trainer Routes (One to Many relationship)

### 5. Create Trainer
```bash
curl -X POST http://localhost:3000/admin/trainers \
  -H "Authorization: Bearer <token>" \
  -F "name=John Smith" \
  -F "email=john.smith@example.com" \
  -F "password=coach1pass" \
  -F "phone=01789456123" \
  -F "specialty=Yoga"
```
✅ Success `201`
```json
{
  "id": 1,
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "01789456123",
  "specialty": "Yoga",
  "isActive": true,
  "createdAt": "2026-07-01T00:00:00.000Z"
}
```
❌ Duplicate email `409`
```json
{ "message": "Trainer with this email already exists", "statusCode": 409 }
```
❌ Phone not starting with 01 `400`
```json
{ "message": ["Phone number must start with 01"], "statusCode": 400 }
```
❌ Name has special chars `400`
```json
{ "message": ["Name must not contain special characters"], "statusCode": 400 }
```

---

### 6. Get All Trainers
```bash
curl -X GET http://localhost:3000/admin/trainers \
  -H "Authorization: Bearer <token>"
```
✅ Success `200`
```json
[
  {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "01789456123",
    "specialty": "Yoga",
    "isActive": true,
    "createdBy": {
      "id": "ADM-123456",
      "email": "admin@fittrack.com"
    }
  }
]
```

---

### 7. Get My Trainers (created by logged-in admin)
```bash
curl -X GET http://localhost:3000/admin/trainers/my \
  -H "Authorization: Bearer <token>"
```
✅ Success `200`
```json
[
  {
    "id": 1,
    "name": "John Smith",
    "phone": "01789456123",
    "isActive": true
  }
]
```

---

### 8. Get Trainer by ID
```bash
curl -X GET http://localhost:3000/admin/trainers/1 \
  -H "Authorization: Bearer <token>"
```
✅ Success `200`
```json
{
  "id": 1,
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "01789456123",
  "specialty": "Yoga",
  "isActive": true,
  "createdBy": {
    "id": "ADM-123456",
    "email": "admin@fittrack.com"
  }
}
```
❌ Not found `404`
```json
{ "message": "Trainer with ID 99 not found", "statusCode": 404 }
```

---

### 9. Update Trainer
```bash
curl -X PATCH http://localhost:3000/admin/trainers/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "specialty": "HIIT",
    "phone": "01855667788"
  }'
```
✅ Success `200`
```json
{
  "id": 1,
  "name": "John Smith",
  "phone": "01855667788",
  "specialty": "HIIT",
  "isActive": true
}
```

---

### 10. Delete Trainer
```bash
curl -X DELETE http://localhost:3000/admin/trainers/1 \
  -H "Authorization: Bearer <token>"
```
✅ Success `200`
```json
{ "message": "Trainer 1 deleted successfully" }
```
❌ Not found `404`
```json
{ "message": "Trainer with ID 1 not found", "statusCode": 404 }
```

---

## AdminUser Routes (Category 2 TypeORM)

### 11. Create Admin User
```bash
curl -X POST http://localhost:3000/admin/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01711223344",
    "isActive": true
  }'
```
✅ Success `201`
```json
{
  "id": "ADM-789012",
  "isActive": true,
  "createdAt": "2026-07-01T00:00:00.000Z"
}
```

---

### 12. Update Phone
```bash
curl -X PATCH http://localhost:3000/admin/users/ADM-789012/phone \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01999888777"
  }'
```
✅ Success `200`
```json
{
  "id": 1,
  "phone": "01999888777",
  "fullName": null,
  "country": null
}
```
❌ Not found `404`
```json
{ "message": "Profile for admin ADM-789012 not found", "statusCode": 404 }
```

---

### 13. Get Users with Null FullName
```bash
curl -X GET http://localhost:3000/admin/users/null-fullname \
  -H "Authorization: Bearer <token>"
```
✅ Success `200`
```json
[
  {
    "id": 1,
    "fullName": null,
    "phone": "01999888777",
    "adminUser": {
      "id": "ADM-789012",
      "isActive": true
    }
  }
]
```

---

### 14. Delete Admin User
```bash
curl -X DELETE http://localhost:3000/admin/users/ADM-789012 \
  -H "Authorization: Bearer <token>"
```
✅ Success `200`
```json
{ "message": "Admin user ADM-789012 removed successfully" }
```
❌ Not found `404`
```json
{ "message": "Admin user with ID ADM-789012 not found", "statusCode": 404 }
```

---

## Announcement Routes

### 15. Create Announcement
```bash
curl -X POST http://localhost:3000/admin/announcements \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Gym closed Friday",
    "body": "The gym will be closed this Friday for maintenance.",
    "target_role": "all"
  }'
```
✅ Success `201`
```json
{
  "message": "Announcement created successfully",
  "announcement": {
    "id": "ann_1",
    "title": "Gym closed Friday",
    "body": "The gym will be closed this Friday for maintenance.",
    "target_role": "all",
    "is_active": true
  }
}
```

---

### 16. Get All Announcements
```bash
curl -X GET http://localhost:3000/admin/announcements \
  -H "Authorization: Bearer <token>"
```
✅ Success `200`
```json
[
  {
    "id": "ann_1",
    "title": "Gym closed Friday",
    "body": "The gym will be closed this Friday for maintenance.",
    "target_role": "all",
    "is_active": true
  }
]
```

---

## Dashboard

### 17. Get Dashboard Stats
```bash
curl -X GET http://localhost:3000/admin/dashboard \
  -H "Authorization: Bearer <token>"
```
✅ Success `200`
```json
{
  "totalAdmins": 1,
  "totalTrainers": 2,
  "activeTrainers": 2,
  "totalAnnouncements": 1
}
```

---

## Recommended Testing Order

```
1.  POST /admin/auth/register     → register, check email inbox (bonus mailer)
2.  POST /admin/auth/login        → copy access_token
3.  GET  /admin/profile           → confirm One to One loads profile
4.  PUT  /admin/profile           → update profile fields
5.  POST /admin/trainers          → create trainer (One to Many)
6.  GET  /admin/trainers          → confirm createdBy admin shown
7.  GET  /admin/trainers/my       → confirm only your trainers shown
8.  GET  /admin/trainers/1        → get single trainer
9.  PATCH /admin/trainers/1       → update trainer
10. DELETE /admin/trainers/1      → delete trainer
11. POST /admin/users             → create admin user
12. PATCH /admin/users/:id/phone  → update phone
13. GET  /admin/users/null-fullname → list null fullName profiles
14. DELETE /admin/users/:id       → remove admin user
15. POST /admin/announcements     → create announcement
16. GET  /admin/announcements     → list announcements
17. GET  /admin/dashboard         → check stats
```

---

## Common Errors Quick Reference

| Error | Status | Cause |
|---|---|---|
| `Access denied — valid JWT token required` | 401 | Missing or expired token |
| `Invalid email or password` | 401 | Wrong credentials on login |
| `Email already registered` | 409 | Duplicate email on register |
| `Account is deactivated` | 403 | Admin account set to inactive |
| `Trainer with this email already exists` | 409 | Duplicate trainer email |
| `Trainer with ID X not found` | 404 | Wrong trainer id |
| `Admin user with ID X not found` | 404 | Wrong admin user id |
| `Profile for admin X not found` | 404 | Admin has no profile yet |
| `Validation failed (expected type is application/pdf)` | 422 | Certificate file is not PDF |
| `Validation failed (expected size is less than 5242880)` | 422 | Certificate file exceeds 5MB |
