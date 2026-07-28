# FitTrack Gym Management System - Trainer Module Test Guide

## Table of Contents
- [Setup](#setup)
- [Auth & JWT Endpoints](#auth--jwt-endpoints)
- [Class Management Endpoints](#class-management-endpoints)
- [Attendance & Client Endpoints](#attendance--client-endpoints)
- [Workout Plan Endpoints](#workout-plan-endpoints)
- [Google SMTP Mailer Endpoints](#google-smtp-mailer-endpoints)
- [Error Scenarios](#error-scenarios)
- [Quick Reference Card](#quick-reference-card)

---

## Setup

### Start the Server
```bash
npm run start:dev
```

### Base URL
```
http://localhost:3000
```

---

## Auth & JWT Endpoints

### 1. Trainer Registration (POST /trainer/auth/register)
Hashes password using **BCrypt** and validates Category 2 email rule (`@aiub.edu`).
```bash
curl -X POST http://localhost:3000/trainer/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Alex Carter",
    "email": "alex.carter@aiub.edu",
    "password": "Coach123",
    "phone": "01711223344",
    "gender": "male",
    "age": 30,
    "specialization": "Strength & Conditioning"
  }'
```

### 2. Trainer Login (POST /trainer/auth/login)
Verifies password with BCrypt and returns signed **JWT token**.
```bash
curl -X POST http://localhost:3000/trainer/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.carter@aiub.edu",
    "password": "Coach123"
  }'
```

---

## Class Management Endpoints

### 3. Get All Classes (GET /trainer/classes)
```bash
curl -X GET "http://localhost:3000/trainer/classes?status=scheduled&page=1&limit=10"
```

### 4. Schedule Class Session (POST /trainer/classes)
```bash
curl -X POST http://localhost:3000/trainer/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Yoga",
    "trainerId": "trainer_1",
    "startTime": "2026-07-01T10:00:00.000Z",
    "endTime": "2026-07-01T11:00:00.000Z",
    "room": "Studio A",
    "maxCapacity": 12
  }'
```

### 5. Get Class by ID (GET /trainer/classes/:id)
```bash
curl -X GET http://localhost:3000/trainer/classes/class_1
```

### 6. Update Class (PATCH /trainer/classes/:id)
```bash
curl -X PATCH http://localhost:3000/trainer/classes/class_1 \
  -H "Content-Type: application/json" \
  -d '{
    "room": "Studio B",
    "maxCapacity": 15
  }'
```

### 7. Cancel Class (DELETE /trainer/classes/:id)
```bash
curl -X DELETE http://localhost:3000/trainer/classes/class_1
```

---

## Attendance & Client Endpoints

### 8. Record Attendance (POST /trainer/classes/:classId/attendance)
```bash
curl -X POST http://localhost:3000/trainer/classes/class_1/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "member_1",
    "memberName": "Sarah Johnson",
    "status": "present"
  }'
```

### 9. Get Attendance Roster (GET /trainer/classes/:classId/attendance)
```bash
curl -X GET http://localhost:3000/trainer/classes/class_1/attendance
```

### 10. View Client Roster (GET /trainer/clients)
```bash
curl -X GET http://localhost:3000/trainer/clients
```

---

## Workout Plan Endpoints

### 11. Create Workout Plan (POST /trainer/workout-plans)
```bash
curl -X POST http://localhost:3000/trainer/workout-plans \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hypertrophy Upper Body",
    "memberId": "member_1",
    "memberName": "Sarah Johnson",
    "exercises": "Bench Press 4x10, Incline Dumbbell Press 3x12, Barbell Row 4x10",
    "difficultyLevel": "Advanced"
  }'
```

### 12. Get Workout Plans (GET /trainer/workout-plans)
```bash
curl -X GET http://localhost:3000/trainer/workout-plans
```

---

## Google SMTP Mailer Endpoints

### 13. Send Class Schedule Update Email (POST /trainer/mail/send-schedule)
Uses `@nestjs-modules/mailer` with Google SMTP (`smtp.gmail.com`).
```bash
curl -X POST http://localhost:3000/trainer/mail/send-schedule \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "sarah.j@example.com",
    "subject": "Yoga Session Update",
    "messageContent": "Your Yoga class is scheduled for tomorrow at 10 AM in Studio A.",
    "memberName": "Sarah Johnson"
  }'
```

### 14. Send Workout Reminder Email (POST /trainer/mail/send-reminder)
```bash
curl -X POST http://localhost:3000/trainer/mail/send-reminder \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "sarah.j@example.com",
    "subject": "Gym Attendance Reminder",
    "messageContent": "Don't forget your scheduled workout session today at 5 PM!",
    "memberName": "Sarah Johnson"
  }'
```

---

## Quick Reference Card

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/trainer/auth/register` | Register new Trainer (BCrypt + Category 2 Pipe) |
| POST | `/trainer/auth/login` | Login Trainer & generate JWT Token |
| GET | `/trainer/profile` | Get Trainer profile & specialization |
| PUT | `/trainer/profile` | Update Trainer profile (Category 2 Pipe validation) |
| GET | `/trainer/classes` | Get classes (filtered & paginated) |
| POST | `/trainer/classes` | Schedule new class session |
| GET | `/trainer/classes/:id` | Get class details by ID |
| PATCH | `/trainer/classes/:id` | Update class room/capacity/status |
| DELETE | `/trainer/classes/:id` | Cancel/delete class session |
| POST | `/trainer/classes/:classId/attendance` | Record member attendance |
| GET | `/trainer/classes/:classId/attendance` | Get attendance roster for class |
| GET | `/trainer/clients` | View client roster |
| POST | `/trainer/workout-plans` | Create custom workout plan |
| GET | `/trainer/workout-plans` | Get all workout plans |
| POST | `/trainer/mail/send-schedule` | Send email notification via Google SMTP |
| POST | `/trainer/mail/send-reminder` | Send workout reminder email via Google SMTP |

---

**End of Trainer Module Test Guide**
