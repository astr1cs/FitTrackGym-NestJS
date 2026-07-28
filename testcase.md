# 🛡️ FitTrack Gym Management System - Trainer Module Postman Defense Testcases Guide

This document provides a comprehensive, step-by-step **Postman Test & Validation Guide** for the **Trainer Module** designed specifically for project **Defense / Viva Examination**.

---

## 📋 Defense Checklist & Environment Setup

### 1. Start NestJS Backend Server
```bash
npm run start:dev
```
Verify output: `[NestApplication] Nest application successfully started`.

### 2. Base URL
```
http://localhost:3000
```

### 3. Postman Environment Variables
Set the following environment variables in your Postman collection:

| Variable Name | Sample Value | Purpose |
|---|---|---|
| `base_url` | `http://localhost:3000` | Base API server address |
| `jwt_token` | `eyJhbGciOiJIUzI1NiIsIn...` | Bearer token stored after login |
| `class_id` | `class_1` | Target class session ID |
| `member_id` | `member_1` | Target member ID |

---

## 🧪 Postman Defense Validation Test Cases

---

### Test Case 1: Trainer Registration (BCrypt & Category 2 Pipe Validation)
- **Method**: `POST`
- **Endpoint**: `{{base_url}}/trainer/auth/register`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "fullName": "Alex Carter",
  "email": "alex.carter@aiub.edu",
  "password": "Coach123",
  "phone": "01711223344",
  "gender": "male",
  "age": 30,
  "specialization": "Strength & Conditioning"
}
```
- **Expected Status**: `201 Created`
- **Expected Response**:
```json
{
  "message": "Trainer registered successfully",
  "trainer": {
    "fullName": "Alex Carter",
    "email": "alex.carter@aiub.edu",
    "phone": "01711223344",
    "gender": "male",
    "age": 30,
    "status": "active",
    "role": "trainer",
    "id": "trainer_1"
  }
}
```
- **Defense Explanation**: Password is automatically hashed using **BCrypt (salt rounds = 10)**. Email domain is verified against `@aiub.edu` via `AiubEmailValidationPipe`.

---

### Test Case 2: Validation Failure — Non-AIUB Email Domain (Category 2 Rule Violation)
- **Method**: `POST`
- **Endpoint**: `{{base_url}}/trainer/auth/register`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john.doe@gmail.com",
  "password": "Coach123"
}
```
- **Expected Status**: `400 Bad Request`
- **Expected Response**:
```json
{
  "statusCode": 400,
  "message": "Email Address field is required, and input must contain aiub.edu domain",
  "error": "Bad Request"
}
```
- **Defense Explanation**: Demonstrates custom NestJS `PipeTransform` interception returning standard HTTP 400 validation error.

---

### Test Case 3: Trainer Login & JWT Token Generation
- **Method**: `POST`
- **Endpoint**: `{{base_url}}/trainer/auth/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "alex.carter@aiub.edu",
  "password": "Coach123"
}
```
- **Expected Status**: `200 OK`
- **Expected Response**:
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "trainer_1",
    "email": "alex.carter@aiub.edu",
    "role": "trainer"
  }
}
```
- **Defense Explanation**: BCrypt compares provided plain password with hashed DB secret. If valid, `@nestjs/jwt` generates a signed JWT payload containing `sub`, `email`, and `role`. Copy `access_token` into Postman `jwt_token`.

---

### Test Case 4: Unauthorized Access (Missing JWT Guard Token)
- **Method**: `GET`
- **Endpoint**: `{{base_url}}/trainer/profile`
- **Headers**: *(No Authorization Header)*
- **Expected Status**: `401 Unauthorized`
- **Expected Response**:
```json
{
  "statusCode": 401,
  "message": "Authentication token is required or invalid",
  "error": "Unauthorized"
}
```
- **Defense Explanation**: Proves route protection using `JwtAuthGuard`. Unauthenticated calls are blocked automatically.

---

### Test Case 5: Get Trainer Profile (One-to-One Relationship)
- **Method**: `GET`
- **Endpoint**: `{{base_url}}/trainer/profile`
- **Headers**: 
  - `Authorization`: `Bearer {{jwt_token}}`
- **Expected Status**: `200 OK`
- **Expected Response**:
```json
{
  "id": "trainer_1",
  "fullName": "Alex Carter",
  "email": "alex.carter@aiub.edu",
  "phone": "01711223344",
  "gender": "male",
  "profile": {
    "id": "prof_1",
    "bio": "Certified Master Trainer with 5 years experience",
    "specialization": "Strength & Conditioning",
    "certification": "NASM-CPT",
    "experienceYears": 5,
    "hourlyRate": 50
  }
}
```
- **Defense Explanation**: Demonstrates TypeORM **One-to-One relationship** (`TrainerEntity` <---> `TrainerProfileEntity`) loaded via eager relations.

---

### Test Case 6: Schedule Class Session (One-to-Many Relationship)
- **Method**: `POST`
- **Endpoint**: `{{base_url}}/trainer/classes`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Advanced Pilates",
  "trainerId": "trainer_1",
  "startTime": "2026-07-01T10:00:00.000Z",
  "endTime": "2026-07-01T11:00:00.000Z",
  "room": "Studio B",
  "maxCapacity": 12
}
```
- **Expected Status**: `201 Created`
- **Expected Response**:
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
- **Defense Explanation**: Creates a `ClassSessionEntity` record owned by the logged-in `TrainerEntity` (**One-to-Many**).

---

### Test Case 7: Conflict Exception — Duplicate Class Schedule Error
- **Method**: `POST`
- **Endpoint**: `{{base_url}}/trainer/classes`
- **Headers**: `Content-Type: application/json`
- **Request Body**: *(Same payload as Test Case 6)*
- **Expected Status**: `409 Conflict`
- **Expected Response**:
```json
{
  "statusCode": 409,
  "message": "Class scheduled at this time already exists",
  "error": "Conflict"
}
```
- **Defense Explanation**: NestJS `ConflictException` is thrown when attempting to book a class with duplicate title and start time.

---

### Test Case 8: Query Classes with Filtering & Pagination
- **Method**: `GET`
- **Endpoint**: `{{base_url}}/trainer/classes?status=scheduled&page=1&limit=2`
- **Expected Status**: `200 OK`
- **Expected Response**:
```json
{
  "data": [
    {
      "id": "class_1",
      "name": "Yoga Flow",
      "status": "scheduled"
    },
    {
      "id": "class_2",
      "name": "HIIT Workout",
      "status": "scheduled"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 2,
  "totalPages": 2
}
```
- **Defense Explanation**: Demonstrates use of NestJS `@Query('status')`, `@Query('page')`, `@Query('limit')` decorators.

---

### Test Case 9: Get Single Class Session by ID
- **Method**: `GET`
- **Endpoint**: `{{base_url}}/trainer/classes/class_1`
- **Expected Status**: `200 OK`
- **Expected Response**:
```json
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
```

---

### Test Case 10: Not Found Exception — Invalid Class ID
- **Method**: `GET`
- **Endpoint**: `{{base_url}}/trainer/classes/class_999`
- **Expected Status**: `404 Not Found`
- **Expected Response**:
```json
{
  "statusCode": 404,
  "message": "Class with ID class_999 not found",
  "error": "Not Found"
}
```
- **Defense Explanation**: Shows NestJS `NotFoundException` handling when a queried entity ID does not exist.

---

### Test Case 11: Record Member Attendance (Many-to-One Relationship)
- **Method**: `POST`
- **Endpoint**: `{{base_url}}/trainer/classes/class_1/attendance`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "memberId": "member_1",
  "memberName": "Sarah Johnson",
  "status": "present"
}
```
- **Expected Status**: `201 Created`
- **Expected Response**:
```json
{
  "message": "Attendance recorded successfully",
  "record": {
    "id": "att_1",
    "classId": "class_1",
    "memberId": "member_1",
    "memberName": "Sarah Johnson",
    "status": "present",
    "recorded_at": "2026-07-28T20:30:00.000Z"
  }
}
```
- **Defense Explanation**: Inserts `AttendanceEntity` with a **Many-to-One** relationship link to `ClassSessionEntity`.

---

### Test Case 12: Create Custom Workout Plan
- **Method**: `POST`
- **Endpoint**: `{{base_url}}/trainer/workout-plans`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "Hypertrophy Upper Body Routine",
  "memberId": "member_1",
  "memberName": "Sarah Johnson",
  "exercises": "Bench Press 4x10, Incline Dumbbell Press 3x12, Barbell Row 4x10",
  "difficultyLevel": "Advanced"
}
```
- **Expected Status**: `201 Created`
- **Expected Response**:
```json
{
  "message": "Workout plan created successfully",
  "plan": {
    "id": "wp_1",
    "title": "Hypertrophy Upper Body Routine",
    "memberId": "member_1",
    "memberName": "Sarah Johnson",
    "exercises": "Bench Press 4x10, Incline Dumbbell Press 3x12, Barbell Row 4x10",
    "difficultyLevel": "Advanced"
  }
}
```

---

### Test Case 13: Send Schedule Notification (Google SMTP Mailer)
- **Method**: `POST`
- **Endpoint**: `{{base_url}}/trainer/mail/send-schedule`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "recipientEmail": "member@example.com",
  "subject": "Yoga Session Update",
  "messageContent": "Your Yoga class is scheduled for tomorrow at 10 AM in Studio A.",
  "memberName": "Sarah Johnson"
}
```
- **Expected Status**: `201 Created`
- **Expected Response**:
```json
{
  "success": true,
  "message": "Schedule notification email sent to member@example.com via Google SMTP"
}
```
- **Defense Explanation**: Uses `@nestjs-modules/mailer` with Google SMTP (`smtp.gmail.com` on port 587) to send HTML emails.

---

### Test Case 14: Send Member Workout Reminder (Google SMTP Mailer)
- **Method**: `POST`
- **Endpoint**: `{{base_url}}/trainer/mail/send-reminder`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "recipientEmail": "member@example.com",
  "subject": "Workout Session Today",
  "messageContent": "Don't forget your 5:00 PM workout session today!",
  "memberName": "Sarah Johnson"
}
```
- **Expected Status**: `201 Created`
- **Expected Response**:
```json
{
  "success": true,
  "message": "Reminder email sent successfully to member@example.com"
}
```

---

## 🎤 Defense Viva Q&A Quick Sheet

### Q1: How did you implement password security?
> **Answer**: Passwords are never stored in plain text. During registration (`POST /trainer/auth/register`), `bcrypt.hash(password, 10)` generates a salt and hash. During login (`POST /trainer/auth/login`), `bcrypt.compare()` verifies the credential.

### Q2: How do your TypeORM relationships work?
> **Answer**: We implemented two types of TypeORM relationships:
> 1. **One-to-One**: `TrainerEntity` <---> `TrainerProfileEntity` (a trainer has one profile).
> 2. **One-to-Many**: `TrainerEntity` ---> `ClassSessionEntity` & `WorkoutPlanEntity` (a trainer creates multiple classes and workout plans).
> 3. **Many-to-One**: `AttendanceEntity` ---> `ClassSessionEntity` (multiple attendance entries belong to a class session).

### Q3: How did you enforce the Category 2 Custom Pipe rules?
> **Answer**: We created `AiubEmailValidationPipe` implementing `PipeTransform`. It checks if the string ends with `@aiub.edu` and throws `BadRequestException` if it fails. We also used `class-validator` decorators (`@MinLength`, `@Matches`, `@IsIn`) on DTOs.

### Q4: How is Google SMTP configured?
> **Answer**: In `TrainerModule`, `MailerModule.forRoot()` configures transport with `smtp.gmail.com`, port `587`, and authentication credentials. `TrainerMailService` calls `this.mailerService.sendMail()` to deliver formatted HTML templates.
