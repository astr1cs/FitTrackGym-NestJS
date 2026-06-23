# FitTrack Gym Management System - Trainer Module Test Guide

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

### Step 1: Get Initial Classes (Pre-seeded Data)

**Request:**
```bash
curl -X GET http://localhost:3000/trainer/classes
```

---

### Step 2: Schedule a New Class Session

**Request:**
```bash
curl -X POST http://localhost:3000/trainer/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Yoga",
    "trainerId": "trainer_1",
    "startTime": "2026-06-25T10:00:00.000Z",
    "endTime": "2026-06-25T11:00:00.000Z",
    "room": "Studio A",
    "maxCapacity": 12
  }'
```

**Schedule Another Class (for filtering and paginating):**
```bash
curl -X POST http://localhost:3000/trainer/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spinning Class",
    "trainerId": "trainer_1",
    "startTime": "2026-06-26T15:00:00.000Z",
    "endTime": "2026-06-26T16:00:00.000Z",
    "room": "Studio C",
    "maxCapacity": 15
  }'
```

---

### Step 3: Get Classes with Filtering/Pagination

**3.1 Filter by Status:**
```bash
curl -X GET "http://localhost:3000/trainer/classes?status=scheduled"
```

**3.2 Pagination (Page 1, Limit 2):**
```bash
curl -X GET "http://localhost:3000/trainer/classes?page=1&limit=2"
```

---

### Step 4: Get Class by ID

**Request:**
```bash
curl -X GET http://localhost:3000/trainer/classes/class_3
```

---

### Step 5: Update Class Details (PATCH)

**5.1 Update Class Room and Capacity:**
```bash
curl -X PATCH http://localhost:3000/trainer/classes/class_3 \
  -H "Content-Type: application/json" \
  -d '{
    "room": "Studio B",
    "maxCapacity": 10
  }'
```

**5.2 Update Class Status:**
```bash
curl -X PATCH http://localhost:3000/trainer/classes/class_3 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active"
  }'
```

---

### Step 6: Record Attendance

**6.1 Mark Member 1 Present:**
```bash
curl -X POST http://localhost:3000/trainer/classes/class_3/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "member_1",
    "memberName": "Sarah Johnson",
    "status": "present"
  }'
```

**6.2 Mark Member 2 Absent:**
```bash
curl -X POST http://localhost:3000/trainer/classes/class_3/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "member_2",
    "memberName": "Mike Brown",
    "status": "absent"
  }'
```

---

### Step 7: Get Attendance Roster

**Request:**
```bash
curl -X GET http://localhost:3000/trainer/classes/class_3/attendance
```

---

### Step 8: View Client Roster

**Request:**
```bash
curl -X GET http://localhost:3000/trainer/clients
```

---

### Step 9: Cancel/Delete Class

**Request:**
```bash
curl -X DELETE http://localhost:3000/trainer/classes/class_3
```

**Verify Deletion:**
```bash
curl -X GET http://localhost:3000/trainer/classes/class_3
```

---

## Expected Responses

### Create Class Response
```json
{
  "message": "Class scheduled successfully",
  "class": {
    "id": "class_3",
    "name": "Advanced Yoga",
    "trainerId": "trainer_1",
    "startTime": "2026-06-25T10:00:00.000Z",
    "endTime": "2026-06-25T11:00:00.000Z",
    "room": "Studio A",
    "maxCapacity": 12,
    "status": "scheduled",
    "created_at": "2026-06-23T12:34:56.789Z",
    "updated_at": "2026-06-23T12:34:56.789Z"
  }
}
```

### Get All Classes Response
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
      "status": "scheduled",
      "created_at": "2026-06-23T22:11:57.000Z",
      "updated_at": "2026-06-23T22:11:57.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Update Class Response
```json
{
  "message": "Class updated successfully",
  "class": {
    "id": "class_3",
    "name": "Advanced Yoga",
    "trainerId": "trainer_1",
    "startTime": "2026-06-25T10:00:00.000Z",
    "endTime": "2026-06-25T11:00:00.000Z",
    "room": "Studio B",
    "maxCapacity": 10,
    "status": "scheduled",
    "created_at": "2026-06-23T12:34:56.789Z",
    "updated_at": "2026-06-23T12:35:56.789Z"
  }
}
```

### Record Attendance Response
```json
{
  "message": "Attendance recorded successfully",
  "record": {
    "id": "att_1",
    "classId": "class_3",
    "memberId": "member_1",
    "memberName": "Sarah Johnson",
    "status": "present",
    "recorded_at": "2026-06-23T12:36:56.789Z"
  }
}
```

### Get Attendance Roster Response
```json
{
  "classId": "class_3",
  "className": "Advanced Yoga",
  "records": [
    {
      "id": "att_1",
      "classId": "class_3",
      "memberId": "member_1",
      "memberName": "Sarah Johnson",
      "status": "present",
      "recorded_at": "2026-06-23T12:36:56.789Z"
    }
  ]
}
```

### View Client Roster Response
```json
{
  "data": [
    {
      "id": "member_1",
      "name": "Sarah Johnson",
      "email": "sarah.j@example.com",
      "phone": "555-0199",
      "joinedDate": "2026-06-23T22:11:57.000Z"
    }
  ],
  "total": 1
}
```

---

## Error Scenarios

### 1. Validation Error (Missing Required Fields)
**Request:**
```bash
curl -X POST http://localhost:3000/trainer/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Power Lifting"
  }'
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "trainerId should not be empty",
    "trainerId must be a string",
    "startTime should not be empty",
    "startTime must be a string",
    "endTime should not be empty",
    "endTime must be a string"
  ],
  "error": "Bad Request"
}
```

### 2. Duplicate Class Booking at Same Start Time
**Request:**
```bash
curl -X POST http://localhost:3000/trainer/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Yoga",
    "trainerId": "trainer_1",
    "startTime": "2026-06-25T10:00:00.000Z",
    "endTime": "2026-06-25T11:00:00.000Z"
  }'
```

**Response:**
```json
{
  "statusCode": 409,
  "message": "Class scheduled at this time already exists",
  "error": "Conflict"
}
```

### 3. Class Session Not Found Error
**Request:**
```bash
curl -X GET http://localhost:3000/trainer/classes/class_999
```

**Response:**
```json
{
  "statusCode": 404,
  "message": "Class with ID class_999 not found",
  "error": "Not Found"
}
```

### 4. Invalid Attendance Status (class-validator enum test)
**Request:**
```bash
curl -X POST http://localhost:3000/trainer/classes/class_1/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "member_1",
    "memberName": "Sarah Johnson",
    "status": "maybe"
  }'
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "Status must be present or absent"
  ],
  "error": "Bad Request"
}
```

---

## Cleanup

### Delete All Test Data
Restart the in-memory backend server to clear updates:
```bash
# Stop server (Ctrl+C)
# Restart
npm run start:dev
```

---

## Quick Reference Card

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/trainer/classes` | Get classes (with status, page, limit filters) |
| 2 | POST | `/trainer/classes` | Schedule a class session |
| 3 | GET | `/trainer/classes/:id` | Get class by ID |
| 4 | PATCH | `/trainer/classes/:id` | Update class details (partial update) |
| 5 | DELETE | `/trainer/classes/:id` | Cancel/delete a class session |
| 6 | POST | `/trainer/classes/:classId/attendance` | Record/update class attendance |
| 7 | GET | `/trainer/classes/:classId/attendance` | View class attendance roster |
| 8 | GET | `/trainer/clients` | View trainer's client roster |

---

## Postman Collection Variables

Configure these variables in your Postman Environment:

```json
{
  "base_url": "http://localhost:3000",
  "class_id": "class_3",
  "member_id": "member_1"
}
```

---

## Testing Checklist

- [ ] Server is running on http://localhost:3000
- [ ] Pre-seeded classes and client lists load correctly
- [ ] Scheduling new classes creates a `class_3` session with full validation
- [ ] Status filters and pagination work properly on `GET /trainer/classes`
- [ ] Single class retrieval works
- [ ] PATCH endpoint modifies class room, capacity, and status
- [ ] Attendance is successfully recorded/overwritten for members
- [ ] Attendance query loads recorded values for specific class
- [ ] Client roster lists all members
- [ ] Deleting/cancelling class succeeds
- [ ] Custom validation checks handle bad request schemas and output valid HTTP errors (400, 404, 409)

---

**End of Trainer Module Test Guide**
