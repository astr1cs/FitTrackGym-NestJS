# 🛡️ FitTrack Gym Management System - Trainer Module Postman Defense Guide (8 Routes)

This document provides the step-by-step **Postman Test Guide** for the **Trainer Module** for **Defense / Viva Examination**.

---

## 📋 Defense Environment Setup
- **Base URL**: `http://localhost:3000`
- **Headers**: `Content-Type: application/json`

---

## 🧪 8 Route Defense Test Cases

### 1. Trainer Registration (BCrypt & Validation Pipe)
- **Method**: `POST`
- **Endpoint**: `http://localhost:3000/trainer/auth/register`
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

---

### 2. Trainer Login & JWT Token
- **Method**: `POST`
- **Endpoint**: `http://localhost:3000/trainer/auth/login`
- **Body**:
```json
{
  "email": "alex.carter@gmail.com",
  "password": "Coach123"
}
```
- **Expected Status**: `200 OK` (Returns signed JWT `access_token`)

---

### 3. Get All Classes (Query Filters & Pagination)
- **Method**: `GET`
- **Endpoint**: `http://localhost:3000/trainer/classes?status=scheduled&page=1&limit=10`
- **Expected Status**: `200 OK`

---

### 4. Schedule Class Session (One-to-Many)
- **Method**: `POST`
- **Endpoint**: `http://localhost:3000/trainer/classes`
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

### 5. Update Profile (One-to-One Relationship)
- **Method**: `PUT`
- **Endpoint**: `http://localhost:3000/trainer/profile`
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

---

### 6. Update Class Session (PATCH)
- **Method**: `PATCH`
- **Endpoint**: `http://localhost:3000/trainer/classes/class_1`
- **Body**:
```json
{
  "room": "Studio C",
  "maxCapacity": 15
}
```
- **Expected Status**: `200 OK`

---

### 7. Cancel Class Session (DELETE)
- **Method**: `DELETE`
- **Endpoint**: `http://localhost:3000/trainer/classes/class_1`
- **Expected Status**: `200 OK`

---

### 8. Send Schedule Email Notification (Google SMTP Mailer)
- **Method**: `POST`
- **Endpoint**: `http://localhost:3000/trainer/mail/send-schedule`
- **Body**:
```json
{
  "recipientEmail": "member@example.com",
  "subject": "Yoga Session Update",
  "messageContent": "Your Yoga class is scheduled for tomorrow at 10 AM in Studio A.",
  "memberName": "Sarah Johnson"
}
```
- **Expected Status**: `201 Created`
