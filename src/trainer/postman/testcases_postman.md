# Trainer Final Project — 8 Routes Test Guide

Base URL: `http://localhost:3000`

> Routes 3–8 require `Authorization: Bearer <token>` — get it from Route 2 (login).

---

## Route 1 — Register
`POST /trainer/auth/register`

BCrypt hashes the password before saving. `EmailValidationPipe` normalizes and validates the email.

```bash
curl -X POST http://localhost:3000/trainer/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Alex Carter",
    "email": "alex.carter@gmail.com",
    "password": "Coach123",
    "phone": "01711223344",
    "gender": "male",
    "age": 30
  }'
```

✅ `201`
```json
{
  "message": "Trainer registered successfully",
  "id": "TRN-123456",
  "email": "alex.carter@gmail.com"
}
```

❌ Duplicate email `409`
```json
{
  "message": "Email already registered",
  "statusCode": 409
}
```

❌ Invalid email `400`
```json
{
  "message": [
    "Invalid email address"
  ],
  "statusCode": 400
}
```

---

## Route 2 — Login
`POST /trainer/auth/login`

Verifies password using BCrypt and returns a signed JWT token.

```bash
curl -X POST http://localhost:3000/trainer/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.carter@gmail.com",
    "password": "Coach123"
  }'
```

✅ `200`
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "alex.carter@gmail.com"
}
```

❌ Invalid credentials `401`
```json
{
  "message": "Invalid email or password",
  "statusCode": 401
}
```

---

## Route 3 — Get Classes
`GET /trainer/classes?status=scheduled&page=1&limit=10`

JWT Guard protected. Returns paginated class sessions filtered by status.

```bash
curl -X GET "http://localhost:3000/trainer/classes?status=scheduled&page=1&limit=10" \
  -H "Authorization: Bearer <your_token>"
```

✅ `200`
```json
{
  "page": 1,
  "limit": 10,
  "total": 5,
  "data": [
    {
      "id": "class_1",
      "name": "Advanced Pilates",
      "status": "scheduled",
      "room": "Studio B",
      "maxCapacity": 12
    }
  ]
}
```

❌ No token `401`
```json
{
  "message": "Access denied — valid JWT token required",
  "statusCode": 401
}
```

---

## Route 4 — Schedule Class
`POST /trainer/classes`

JWT Guard protected. Creates a new training session.

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
  "id": "class_1",
  "name": "Advanced Pilates",
  "room": "Studio B",
  "maxCapacity": 12
}
```

❌ Validation error `400`
```json
{
  "message": [
    "End time must be after start time"
  ],
  "statusCode": 400
}
```

---

## Route 5 — Update Profile
`PUT /trainer/profile`

JWT Guard protected. Updates the linked `TrainerProfileEntity` (One-to-One relationship).

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
  "fullName": "Alex Carter",
  "specialization": "Master Strength & Conditioning",
  "experienceYears": 5,
  "hourlyRate": 60
}
```

❌ Profile not found `404`
```json
{
  "message": "Trainer profile not found",
  "statusCode": 404
}
```

❌ No token `401`
```json
{
  "message": "Access denied — valid JWT token required",
  "statusCode": 401
}
```

---

## Route 6 — Update Class Session
`PATCH /trainer/classes/:id`

JWT Guard protected. Updates an existing scheduled class.

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
  "id": "class_1",
  "room": "Studio C",
  "maxCapacity": 15
}
```

❌ Class not found `404`
```json
{
  "message": "Class not found",
  "statusCode": 404
}
```

---

## Route 7 — Delete Class
`DELETE /trainer/classes/:id`

JWT Guard protected. Deletes a scheduled class.

```bash
curl -X DELETE http://localhost:3000/trainer/classes/class_1 \
  -H "Authorization: Bearer <your_token>"
```

✅ `200`
```json
{
  "message": "Class deleted successfully"
}
```

❌ Class not found `404`
```json
{
  "message": "Class not found",
  "statusCode": 404
}
```

❌ No token `401`
```json
{
  "message": "Access denied — valid JWT token required",
  "statusCode": 401
}
```

---

## Route 8 — Send Schedule Email
`POST /trainer/mail/send-schedule`

JWT Guard protected. Sends an HTML schedule notification email using Google SMTP (`smtp.gmail.com`).

```bash
curl -X POST http://localhost:3000/trainer/mail/send-schedule \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "member@example.com",
    "subject": "Upcoming Yoga Session",
    "messageContent": "Your Yoga class is scheduled for tomorrow at 10 AM in Studio A.",
    "memberName": "Sarah Johnson"
  }'
```

✅ `201`
```json
{
  "message": "Schedule email sent successfully"
}
```

❌ Invalid recipient email `400`
```json
{
  "message": [
    "recipientEmail must be an email"
  ],
  "statusCode": 400
}
```

❌ SMTP error `500`
```json
{
  "message": "Failed to send email",
  "statusCode": 500
}
```

---

# Testing Order

```text
1. POST /trainer/auth/register            → register trainer (BCrypt + EmailValidationPipe)
2. POST /trainer/auth/login               → copy access_token
3. GET  /trainer/classes                  → verify paginated class list
4. POST /trainer/classes                  → create a new class session
5. PUT  /trainer/profile                  → update TrainerProfile (One-to-One)
6. PATCH /trainer/classes/class_1         → modify class details
7. DELETE /trainer/classes/class_1        → delete class session
8. POST /trainer/mail/send-schedule       → verify Google SMTP email delivery
```

---

# Requirements Coverage

| Requirement | Covered by |
|---|---|
| 8 REST routes (GET, POST, PUT, PATCH, DELETE) | Routes 1–8 |
| TypeORM database operations | Routes 1–7 |
| Pipes validation | Routes 1, 4, 5, 8 |
| JWT + Guards | Routes 3–8 |
| BCrypt password hashing | Routes 1, 2 |
| One-to-One relationship | Route 5 (Trainer ↔ TrainerProfile) |
| Pagination & filtering | Route 3 |
| CRUD operations | Routes 3–7 |
| HttpException handling | All protected routes |
| Google SMTP Mailer | Route 8 |