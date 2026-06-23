# FitTrack Gym Management System - Admin Module Test Guide

## Table of Contents
- [Setup](#setup)
- [Test Sequence](#test-sequence)
- [Expected Responses](#expected-responses)
- [Error Scenarios](#error-scenarios)
- [Cleanup](#cleanup)

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

### Headers for All Requests
```
Content-Type: application/json
```

---

## Test Sequence

### Step 1: Create First Trainer

**Request:**
```bash
curl -X POST http://localhost:3000/admin/trainers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@trainer.com",
    "password": "password123",
    "phone": "+1234567890",
    "specialty": "Yoga",
    "bio": "Certified Yoga Instructor with 5 years of experience",
    "experience_years": 5,
    "certification": "RYT-200"
  }'
```

**Create Second Trainer (for testing filters):**
```bash
curl -X POST http://localhost:3000/admin/trainers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@trainer.com",
    "password": "password456",
    "phone": "+1234567891",
    "specialty": "Pilates",
    "bio": "Expert Pilates instructor",
    "experience_years": 3,
    "certification": "Pilates Certified"
  }'
```

**Create Third Trainer:**
```bash
curl -X POST http://localhost:3000/admin/trainers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mike Johnson",
    "email": "mike@trainer.com",
    "password": "password789",
    "phone": "+1234567892",
    "specialty": "HIIT",
    "bio": "High Intensity Interval Training specialist",
    "experience_years": 7,
    "certification": "HIIT Level 3"
  }'
```

---

### Step 2: Get Dashboard

**Request:**
```bash
curl -X GET http://localhost:3000/admin/dashboard
```

---

### Step 3: Get All Trainers

**3.1 Get All Trainers (No Filters):**
```bash
curl -X GET http://localhost:3000/admin/trainers
```

**3.2 Get Trainers with Pagination:**
```bash
curl -X GET "http://localhost:3000/admin/trainers?page=1&limit=5"
```

**3.3 Get Trainers Filter by Specialty:**
```bash
curl -X GET "http://localhost:3000/admin/trainers?specialty=Yoga"
```

**3.4 Get Trainers Filter by Active Status:**
```bash
curl -X GET "http://localhost:3000/admin/trainers?isActive=true"
```

**3.5 Get Trainers with Combined Filters:**
```bash
curl -X GET "http://localhost:3000/admin/trainers?specialty=Yoga&isActive=true&page=1&limit=5"
```

---

### Step 4: Get Trainer by ID

**Request:**
```bash
curl -X GET http://localhost:3000/admin/trainers/trainer_1
```

**Get Another Trainer:**
```bash
curl -X GET http://localhost:3000/admin/trainers/trainer_2
```

---

### Step 5: Update Trainer

**5.1 Update Trainer Name and Experience:**
```bash
curl -X PUT http://localhost:3000/admin/trainers/trainer_1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "experience_years": 10
  }'
```

**5.2 Update Trainer Specialty and Bio:**
```bash
curl -X PUT http://localhost:3000/admin/trainers/trainer_1 \
  -H "Content-Type: application/json" \
  -d '{
    "specialty": "Senior Yoga Instructor",
    "bio": "Senior instructor specializing in advanced yoga techniques"
  }'
```

**5.3 Update Trainer Phone and Certification:**
```bash
curl -X PUT http://localhost:3000/admin/trainers/trainer_1 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+9876543210",
    "certification": "RYT-500"
  }'
```

---

### Step 6: Deactivate Trainer

**Request:**
```bash
curl -X PATCH http://localhost:3000/admin/trainers/trainer_1/deactivate
```

**Verify Deactivation (Check is_active field in response):**
```bash
curl -X GET http://localhost:3000/admin/trainers/trainer_1
```

---

### Step 7: Create Announcement

**7.1 Create Announcement for All Users:**
```bash
curl -X POST http://localhost:3000/admin/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Holiday Schedule Update",
    "body": "The gym will be closed on July 4th for Independence Day. Regular hours resume July 5th.",
    "target_role": "all"
  }'
```

**7.2 Create Announcement for Members Only:**
```bash
curl -X POST http://localhost:3000/admin/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Yoga Class Added",
    "body": "New evening Yoga class starting at 6:30 PM every Tuesday and Thursday.",
    "target_role": "member"
  }'
```

**7.3 Create Announcement for Trainers Only:**
```bash
curl -X POST http://localhost:3000/admin/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Trainer Meeting",
    "body": "All trainers please attend mandatory meeting on Friday at 9:00 AM.",
    "target_role": "trainer"
  }'
```

---

### Step 8: Delete Trainer

**Request:**
```bash
curl -X DELETE http://localhost:3000/admin/trainers/trainer_1
```

**Verify Deletion:**
```bash
curl -X GET http://localhost:3000/admin/trainers/trainer_1
```

---

## Expected Responses

### Create Trainer Response
```json
{
  "message": "Trainer created successfully",
  "trainer": {
    "id": "trainer_1",
    "name": "John Doe",
    "email": "john@trainer.com",
    "phone": "+1234567890",
    "specialty": "Yoga",
    "bio": "Certified Yoga Instructor with 5 years of experience",
    "experience_years": 5,
    "certification": "RYT-200",
    "is_active": true,
    "created_at": "2026-06-23T12:34:56.789Z",
    "updated_at": "2026-06-23T12:34:56.789Z",
    "classesAssigned": 0
  }
}
```

### Dashboard Response
```json
{
  "totalBookings": 156,
  "totalActiveMembers": 342,
  "totalActiveTrainers": 3,
  "totalPendingPayments": 23,
  "revenueToday": 1250,
  "revenueThisMonth": 45230,
  "upcomingClasses": 12,
  "recentActivities": [
    {
      "type": "new_member",
      "name": "Sarah Johnson",
      "time": "2026-06-23T12:34:56.789Z"
    },
    {
      "type": "payment",
      "amount": 89.99,
      "member": "Mike Brown",
      "time": "2026-06-23T12:34:56.789Z"
    },
    {
      "type": "class_full",
      "class": "Yoga Flow",
      "time": "2026-06-23T12:34:56.789Z"
    }
  ]
}
```

### Get All Trainers Response
```json
{
  "data": [
    {
      "id": "trainer_1",
      "name": "John Doe",
      "email": "john@trainer.com",
      "phone": "+1234567890",
      "specialty": "Yoga",
      "bio": "Certified Yoga Instructor with 5 years of experience",
      "experience_years": 5,
      "certification": "RYT-200",
      "is_active": true,
      "created_at": "2026-06-23T12:34:56.789Z",
      "updated_at": "2026-06-23T12:34:56.789Z",
      "classesAssigned": 0
    },
    {
      "id": "trainer_2",
      "name": "Jane Smith",
      "email": "jane@trainer.com",
      "phone": "+1234567891",
      "specialty": "Pilates",
      "bio": "Expert Pilates instructor",
      "experience_years": 3,
      "certification": "Pilates Certified",
      "is_active": true,
      "created_at": "2026-06-23T12:34:56.789Z",
      "updated_at": "2026-06-23T12:34:56.789Z",
      "classesAssigned": 0
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Get Trainer by ID Response
```json
{
  "id": "trainer_1",
  "name": "John Doe",
  "email": "john@trainer.com",
  "phone": "+1234567890",
  "specialty": "Yoga",
  "bio": "Certified Yoga Instructor with 5 years of experience",
  "experience_years": 5,
  "certification": "RYT-200",
  "is_active": true,
  "created_at": "2026-06-23T12:34:56.789Z",
  "updated_at": "2026-06-23T12:34:56.789Z",
  "classesAssigned": 0
}
```

### Update Trainer Response
```json
{
  "message": "Trainer updated successfully",
  "trainer": {
    "id": "trainer_1",
    "name": "John Smith",
    "email": "john@trainer.com",
    "phone": "+1234567890",
    "specialty": "Senior Yoga Instructor",
    "bio": "Certified Yoga Instructor with 5 years of experience",
    "experience_years": 10,
    "certification": "RYT-200",
    "is_active": true,
    "created_at": "2026-06-23T12:34:56.789Z",
    "updated_at": "2026-06-23T12:35:56.789Z",
    "classesAssigned": 0
  }
}
```

### Deactivate Trainer Response
```json
{
  "message": "Trainer deactivated successfully",
  "trainer": {
    "id": "trainer_1",
    "name": "John Smith",
    "email": "john@trainer.com",
    "phone": "+1234567890",
    "specialty": "Senior Yoga Instructor",
    "bio": "Certified Yoga Instructor with 5 years of experience",
    "experience_years": 10,
    "certification": "RYT-200",
    "is_active": false,
    "created_at": "2026-06-23T12:34:56.789Z",
    "updated_at": "2026-06-23T12:36:56.789Z",
    "classesAssigned": 0
  }
}
```

### Create Announcement Response
```json
{
  "message": "Announcement created successfully",
  "announcement": {
    "id": "ann_1",
    "title": "Holiday Schedule Update",
    "body": "The gym will be closed on July 4th for Independence Day. Regular hours resume July 5th.",
    "target_role": "all",
    "created_at": "2026-06-23T12:37:56.789Z",
    "updated_at": "2026-06-23T12:37:56.789Z",
    "is_active": true
  }
}
```

### Delete Trainer Response
```json
{
  "message": "Trainer deleted successfully"
}
```

---

## Error Scenarios

### 1. Validation Error (Missing Required Field)
**Request:**
```bash
curl -X POST http://localhost:3000/admin/trainers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@trainer.com"
  }'
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "password should not be empty",
    "password must be longer than or equal to 6 characters",
    "phone should not be empty"
  ],
  "error": "Bad Request"
}
```

### 2. Duplicate Email Error
**Request:**
```bash
curl -X POST http://localhost:3000/admin/trainers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another John",
    "email": "john@trainer.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

**Response:**
```json
{
  "statusCode": 409,
  "message": "Trainer with this email already exists",
  "error": "Conflict"
}
```

### 3. Trainer Not Found Error
**Request:**
```bash
curl -X GET http://localhost:3000/admin/trainers/trainer_999
```

**Response:**
```json
{
  "statusCode": 404,
  "message": "Trainer with ID trainer_999 not found",
  "error": "Not Found"
}
```

### 4. Invalid Email Format
**Request:**
```bash
curl -X POST http://localhost:3000/admin/trainers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid-email",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "Invalid email format"
  ],
  "error": "Bad Request"
}
```

---

## Cleanup

### Delete All Test Data
Since we're using in-memory storage, simply restart the server:
```bash
# Stop server (Ctrl+C)
# Start server again
npm run start:dev
```

### Verify Cleanup
```bash
curl -X GET http://localhost:3000/admin/trainers
```
Should return empty data array.

---

## Quick Reference Card

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/admin/dashboard` | Dashboard statistics |
| 2 | POST | `/admin/trainers` | Create trainer |
| 3 | GET | `/admin/trainers` | Get all trainers (with filters) |
| 4 | GET | `/admin/trainers/:id` | Get trainer by ID |
| 5 | PUT | `/admin/trainers/:id` | Update trainer |
| 6 | PATCH | `/admin/trainers/:id/deactivate` | Deactivate trainer |
| 7 | DELETE | `/admin/trainers/:id` | Delete trainer |
| 8 | POST | `/admin/announcements` | Create announcement |

---

## Postman Collection Variables

Create these environment variables in Postman:

```json
{
  "base_url": "http://localhost:3000",
  "trainer_id": "trainer_1",
  "announcement_id": "ann_1"
}
```

---

## Testing Checklist

- [ ] Server is running on http://localhost:3000
- [ ] Dashboard returns statistics
- [ ] Can create a trainer
- [ ] Can get all trainers with filters
- [ ] Can get single trainer by ID
- [ ] Can update trainer details
- [ ] Can deactivate trainer
- [ ] Can delete trainer
- [ ] Can create announcements
- [ ] Validation errors work correctly
- [ ] Error responses are proper (404, 409, 400)

---

**End of Admin Module Test Guide**