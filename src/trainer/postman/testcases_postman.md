# 🧪 Postman Test Case Validation Guide — Trainer Module (8 Routes)

This guide documents the exact Postman validation steps for the **8 Trainer REST API routes** for defense presentation.

---

## 📌 Environment Setup
- **Base URL**: `http://localhost:3000`
- **Headers**: `Content-Type: application/json`

---

## 🧪 8 Route Validation Steps

### Route 1: `POST /trainer/auth/register` (Auth Signup)
- **Body**:
```json
{
  "fullName": "Alex Carter",
  "email": "alex.carter@gmail.com",
  "password": "Coach123",
  "phone": "01711223344",
  "gender": "male",
  "age": 30
}
```
- **Expected Status**: `201 Created`
- **Validation**: Hashed password (BCrypt), `EmailValidationPipe` normalization.

---

### Route 2: `POST /trainer/auth/login` (Auth Login)
- **Body**:
```json
{
  "email": "alex.carter@gmail.com",
  "password": "Coach123"
}
```
- **Expected Status**: `200 OK`
- **Validation**: Returns signed JWT `access_token`.

---

### Route 3: `GET /trainer/classes` (Get Classes)
- **URL**: `http://localhost:3000/trainer/classes?status=scheduled&page=1&limit=10`
- **Expected Status**: `200 OK`
- **Validation**: Returns paginated data list with status filter.

---

### Route 4: `POST /trainer/classes` (Schedule Class)
- **Body**:
```json
{
  "name": "Advanced Pilates",
  "startTime": "2026-07-01T10:00:00.000Z",
  "endTime": "2026-07-01T11:00:00.000Z",
  "room": "Studio B",
  "maxCapacity": 12
}
```
- **Expected Status**: `201 Created`

---

### Route 5: `PUT /trainer/profile` (Update Profile)
- **Body**:
```json
{
  "fullName": "Alex Carter",
  "email": "alex.carter@gmail.com",
  "specialization": "Master Strength & Conditioning",
  "experienceYears": 5,
  "hourlyRate": 60
}
```
- **Expected Status**: `200 OK`
- **Validation**: Updates One-to-One `TrainerProfileEntity`.

---

### Route 6: `PATCH /trainer/classes/:id` (Update Class Session)
- **URL**: `http://localhost:3000/trainer/classes/class_1`
- **Body**:
```json
{
  "room": "Studio C",
  "maxCapacity": 15
}
```
- **Expected Status**: `200 OK`

---

### Route 7: `DELETE /trainer/classes/:id` (Cancel Class Session)
- **URL**: `http://localhost:3000/trainer/classes/class_1`
- **Expected Status**: `200 OK`
- **Validation**: Message: `"Class deleted successfully"`.

---

### Route 8: `POST /trainer/mail/send-schedule` (Google SMTP Mailer)
- **Body**:
```json
{
  "recipientEmail": "member@example.com",
  "subject": "Upcoming Yoga Session",
  "messageContent": "Your Yoga class is scheduled for tomorrow at 10 AM in Studio A.",
  "memberName": "Sarah Johnson"
}
```
- **Expected Status**: `201 Created`
- **Validation**: Sends HTML notification email via Google SMTP (`smtp.gmail.com`).
