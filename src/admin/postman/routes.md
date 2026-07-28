# Admin Final Project — 7 Routes Test Guide

Base URL: `http://localhost:3000`

> Routes 3–7 require `Authorization: Bearer <token>` — get it from Route 2 (login).

---

## Route 1 — Register
`POST /admin/auth/register`
BCrypt hashes password before saving. Sends welcome email via Gmail on success.

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

✅ `201`
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

## Route 2 — Login
`POST /admin/auth/login`
Verifies password with BCrypt. Returns JWT token on success.

```bash
curl -X POST http://localhost:3000/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fittrack.com",
    "password": "Admin123"
  }'
```

✅ `200` — copy the `access_token`
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

❌ Deactivated account `403`
```json
{ "message": "Account is deactivated", "statusCode": 403 }
```

---

## Route 3 — Get Profile
`GET /admin/profile`
JWT Guard protected. Loads AdminUser with linked AdminProfile — One to One relationship.

```bash
curl -X GET http://localhost:3000/admin/profile \
  -H "Authorization: Bearer <your_token>"
```

✅ `200`
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

❌ User not found `404`
```json
{ "message": "Admin user not found", "statusCode": 404 }
```

---

## Route 4 — Update Profile
`PUT /admin/profile`
JWT Guard protected. Updates AdminProfile linked to logged-in admin — One to One relationship. Pipes validate field lengths.

```bash
curl -X PUT http://localhost:3000/admin/profile \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Admin Name",
    "phone": "01999888777",
    "country": "Bangladesh"
  }'
```

✅ `200`
```json
{
  "id": 1,
  "fullName": "Updated Admin Name",
  "phone": "01999888777",
  "country": "Bangladesh"
}
```

❌ No token `401`
```json
{ "message": "Access denied — valid JWT token required", "statusCode": 401 }
```

❌ Profile not found `404`
```json
{ "message": "Profile not found", "statusCode": 404 }
```

❌ Field too long `400`
```json
{ "message": ["Full name must not exceed 100 characters"], "statusCode": 400 }
```

---

## Route 5 — Create Trainer
`POST /admin/trainers`
JWT Guard protected. BCrypt hashes trainer password. Links trainer to logged-in admin — One to Many relationship. Pipes validate name, phone, password, and certificate file.

```bash
curl -X POST http://localhost:3000/admin/trainers \
  -H "Authorization: Bearer <your_token>" \
  -F "name=John Smith" \
  -F "email=john.smith@example.com" \
  -F "password=coach1pass" \
  -F "phone=01789456123" \
  -F "specialty=Yoga"
```

✅ `201`
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

❌ Duplicate trainer email `409`
```json
{ "message": "Trainer with this email already exists", "statusCode": 409 }
```

❌ Phone not starting with 01 `400`
```json
{ "message": ["Phone number must start with 01"], "statusCode": 400 }
```

❌ Name has special characters `400`
```json
{ "message": ["Name must not contain special characters"], "statusCode": 400 }
```

❌ Password missing lowercase `400`
```json
{ "message": ["Password must contain at least one lowercase character"], "statusCode": 400 }
```

❌ Certificate not a PDF `422`
```json
{ "message": "Validation failed (expected type is application/pdf)", "statusCode": 422 }
```

---

## Route 6 — Get All Trainers
`GET /admin/trainers`
JWT Guard protected. Returns all trainers with their createdBy admin — One to Many relationship visible in response.

```bash
curl -X GET http://localhost:3000/admin/trainers \
  -H "Authorization: Bearer <your_token>"
```

✅ `200`
```json
[
  {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "01789456123",
    "specialty": "Yoga",
    "isActive": true,
    "createdAt": "2026-07-01T00:00:00.000Z",
    "createdBy": {
      "id": "ADM-123456",
      "email": "admin@fittrack.com",
      "isActive": true
    }
  }
]
```

❌ No token `401`
```json
{ "message": "Access denied — valid JWT token required", "statusCode": 401 }
```

---

## Route 7 — Delete Trainer
`DELETE /admin/trainers/:id`
JWT Guard protected. Removes trainer from database by id. HttpException thrown if not found.

```bash
curl -X DELETE http://localhost:3000/admin/trainers/1 \
  -H "Authorization: Bearer <your_token>"
```

✅ `200`
```json
{ "message": "Trainer 1 deleted successfully" }
```

❌ Trainer not found `404`
```json
{ "message": "Trainer with ID 1 not found", "statusCode": 404 }
```

❌ No token `401`
```json
{ "message": "Access denied — valid JWT token required", "statusCode": 401 }
```

---

## Testing Order

```
1. POST /admin/auth/register   → register, check inbox for welcome email (Mailer bonus)
2. POST /admin/auth/login      → copy access_token from response
3. GET  /admin/profile         → confirm One to One: profile loads alongside user
4. PUT  /admin/profile         → update profile fields, confirm One to One save
5. POST /admin/trainers        → create trainer, confirm linked to your admin (One to Many)
6. GET  /admin/trainers        → confirm createdBy field shows your admin (One to Many)
7. DELETE /admin/trainers/1    → delete trainer, confirm removed from DB
```

---

## Requirements Coverage

| Requirement | Covered by |
|---|---|
| 7 routes (GET, POST, PUT, DELETE) | Routes 1–7 |
| TypeORM database operations | All routes hit real DB |
| Pipes validation | Routes 1, 4, 5 |
| One to One relationship | Routes 3, 4 (AdminUser ↔ AdminProfile) |
| One to Many relationship | Routes 5, 6 (AdminUser → Trainers) |
| 3 relationship CRUD routes | Routes 3 (GET), 4 (PUT), 5 (POST) |
| JWT + Guards | Routes 3–7 |
| BCrypt | Routes 1 (register), 5 (create trainer) |
| HttpException | Routes 3–7 (all service methods) |
| Mailer (bonus) | Route 1 (welcome email on register) |