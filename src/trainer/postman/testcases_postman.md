# Trainer Final Project — 8 Routes Test Guide

Base URL: `http://localhost:3000`

> Routes 3–8 require `Authorization: Bearer <token>` — get it from Route 2 (login).
# Trainer Final Project — 8 Routes Test Guide

Base URL: `http://localhost:3000`

> Routes 3–8 require `Authorization: Bearer <token>` — get it from Route 2 (login).

---

## Route 1 — Register
`POST /trainer/auth/register`  
BCrypt hashes password before saving. Normalizes email via `EmailValidationPipe` (accepts any email domain). Automatically sends welcome email via Gmail SMTP on success.

```bash
curl -X POST http://localhost:3000/trainer/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Alex Carter",
    "email": "alex.carter@gmail.com",
    "password": "Coach123",
    "phone": "01711223344",
    "gender": "male",
    "age": 30,
    "specialization": "Strength & Conditioning"
  }'
```

✅ `201`
```json
{
  "message": "Trainer registered successfully",
  "trainer": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Alex Carter",
    "email": "alex.carter@gmail.com",
    "phone": "01711223344",
    "gender": "male",
    "age": 30,
    "status": "active",
    "role": "trainer"
  }
}
```

❌ Duplicate email `409`
```json
{ "message": "Trainer with this email already exists", "statusCode": 409 }
```

❌ Weak password / Missing fields `400`
```json
{ "message": ["Password must contain at least one Uppercase character"], "statusCode": 400 }
```

---

## Route 2 — Login
`POST /trainer/auth/login`  
Verifies password with BCrypt. Returns signed JWT token on success.

```bash
curl -X POST http://localhost:3000/trainer/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.carter@gmail.com",
    "password": "Coach123"
  }'
```

✅ `200` — copy the `access_token`
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alex.carter@gmail.com",
    "role": "trainer"
  }
}
```

❌ Wrong password / Invalid credentials `401`
```json
{ "message": "Invalid email or password", "statusCode": 401 }
```

---

## Route 3 — Get All Classes
`GET /trainer/classes`  
JWT Guard protected. Returns paginated classes with status query filters — One to Many relationship.

```bash
curl -X GET "http://localhost:3000/trainer/classes?status=scheduled&page=1&limit=10" \
  -H "Authorization: Bearer <your_token>"
```

✅ `200`
```json
{
  "data": [
    {
      "id": "class_1",
      "name": "Yoga Flow",
      "trainerId": "trainer_1",
      "startTime": "2026-06-24T22:00:00.000Z",
      "endTime": "2026-06-24T23:00:00.000Z",
      "room": "Studio A",
      "maxCapacity": 15,
      "status": "scheduled"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

❌ No token `401`
```json
{ "message": "Authentication token is required or invalid", "statusCode": 401 }
```

---

## Route 4 — Schedule Class
`POST /trainer/classes`  
JWT Guard protected. Schedules new class session linked to trainer — One to Many relationship. Automatically sends schedule confirmation email via Gmail SMTP.

```bash
curl -X POST http://localhost:3000/trainer/classes \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Pilates",
    "startTime": "2026-07-01T10:00:00.000Z",
    "endTime": "2026-07-01T11:00:00.000Z",
    "room": "Studio B",
    "maxCapacity": 12
  }'
```

✅ `201`
```json
{
  "message": "Class scheduled successfully",
  "class": {
    "id": "class_3",
    "name": "Advanced Pilates",
    "trainerId": "trainer_1",
    "startTime": "2026-07-01T10:00:00.000Z",
    "endTime": "2026-07-01T11:00:00.000Z",
    "room": "Studio B",
    "maxCapacity": 12,
    "status": "scheduled"
  }
}
```

❌ No token `401`
```json
{ "message": "Authentication token is required or invalid", "statusCode": 401 }
```

❌ Schedule conflict `409`
```json
{ "message": "Class scheduled at this time already exists", "statusCode": 409 }
```

---

## Route 5 — Update Profile
`PUT /trainer/profile`  
JWT Guard protected. Updates Trainer and linked TrainerProfile — One to One relationship. `EmailValidationPipe` validates email format.

```bash
curl -X PUT http://localhost:3000/trainer/profile \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Alex Carter",
    "email": "alex.carter@gmail.com",
    "specialization": "Master Strength & Conditioning",
    "experienceYears": 5,
    "hourlyRate": 60
  }'
```

✅ `200`
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "id": "trainer_1",
    "fullName": "Alex Carter",
    "email": "alex.carter@gmail.com",
    "specialization": "Master Strength & Conditioning",
    "experienceYears": 5,
    "hourlyRate": 60
  }
}
```

❌ No token `401`
```json
{ "message": "Authentication token is required or invalid", "statusCode": 401 }
```

❌ Invalid email format `400`
```json
{ "message": "Email Address field must be a valid email format", "statusCode": 400 }
```

---

## Route 6 — Update Class
`PATCH /trainer/classes/:id`  
JWT Guard protected. Partially updates class session room, max capacity, or status — One to Many relationship.

```bash
curl -X PATCH http://localhost:3000/trainer/classes/class_1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "room": "Studio C",
    "maxCapacity": 15
  }'
```

✅ `200`
```json
{
  "message": "Class updated successfully",
  "class": {
    "id": "class_1",
    "name": "Yoga Flow",
    "room": "Studio C",
    "maxCapacity": 15,
    "status": "scheduled"
  }
}
```

❌ No token `401`
```json
{ "message": "Authentication token is required or invalid", "statusCode": 401 }
```

❌ Class not found `404`
```json
{ "message": "Class with ID class_1 not found", "statusCode": 404 }
```

---

## Route 7 — Cancel Class
`DELETE /trainer/classes/:id`  
JWT Guard protected. Removes class session by ID from database. HttpException thrown if not found.

```bash
curl -X DELETE http://localhost:3000/trainer/classes/class_1 \
  -H "Authorization: Bearer <your_token>"
```

✅ `200`
```json
{ "message": "Class deleted successfully" }
```

❌ Class not found `404`
```json
{ "message": "Class with ID class_1 not found", "statusCode": 404 }
```

❌ No token `401`
```json
{ "message": "Authentication token is required or invalid", "statusCode": 401 }
```

---

## Route 8 — Send Schedule Email
`POST /trainer/mail/send-schedule`  
JWT Guard protected. Sends manual class schedule update notification HTML email via Google SMTP (`smtp.gmail.com`).

```bash
curl -X POST http://localhost:3000/trainer/mail/send-schedule \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "member@example.com",
    "subject": "Yoga Session Update",
    "messageContent": "Your Yoga class is scheduled for tomorrow at 10 AM in Studio A.",
    "memberName": "Sarah Johnson"
  }'
```

✅ `201`
```json
{
  "success": true,
  "message": "Schedule notification email sent to member@example.com via Google SMTP"
}
```

❌ No token `401`
```json
{ "message": "Authentication token is required or invalid", "statusCode": 401 }
```

---

## Testing Order

```
1. POST /trainer/auth/register   → register trainer, check inbox for welcome email (Mailer bonus)
2. POST /trainer/auth/login      → copy access_token from response
3. GET  /trainer/classes         → fetch paginated classes with status filter (JWT protected)
4. POST /trainer/classes         → schedule new class session, check inbox for auto class email (Mailer bonus)
5. PUT  /trainer/profile         → update profile details (One to One relationship)
6. PATCH /trainer/classes/class_1→ update class room and capacity (One to Many relationship)
7. DELETE /trainer/classes/class_1→ cancel/delete class session
8. POST /trainer/mail/send-schedule → send manual schedule email notification via Google SMTP
```

---

## Requirements Coverage

| Requirement | Covered by |
|---|---|
| 8 routes (GET, POST, PUT, PATCH, DELETE) | Routes 1–8 |
| TypeORM database operations | All routes hit real DB |
| Pipes validation | Routes 1, 5 (`EmailValidationPipe` + DTO validations) |
| One to One relationship | Route 5 (`TrainerEntity` ↔ `TrainerProfileEntity`) |
| One to Many relationship | Routes 3, 4, 6, 7 (`TrainerEntity` → `ClassSessionEntity`) |
| 3 relationship CRUD routes | Routes 3 (GET), 4 (POST), 5 (PUT), 6 (PATCH), 7 (DELETE) |
| JWT + Guards | Routes 3–8 (`JwtAuthGuard`) |
| BCrypt | Routes 1 (register), 2 (login), 5 (profile password update) |
| HttpException | Routes 1–8 (all service methods) |
| Mailer (bonus) | Routes 1 (auto welcome email), 4 (auto class email), 8 (manual schedule email) |
