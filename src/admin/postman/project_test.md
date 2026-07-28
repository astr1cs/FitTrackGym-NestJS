# Admin — Final Task Test Guide (7 Routes)

Base URL: `http://localhost:3000`

---

## 1. Register (BCrypt + Mailer)
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
{ "message": "Admin registered successfully", "id": "ADM-123456", "email": "admin@fittrack.com" }
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

## 2. Login (JWT)
```bash
curl -X POST http://localhost:3000/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fittrack.com",
    "password": "Admin123"
  }'
```
✅ `200` — copy `access_token` for all routes below
```json
{ "message": "Login successful", "access_token": "eyJhbGci...", "id": "ADM-123456" }
```
❌ Wrong password `401`
```json
{ "message": "Invalid email or password", "statusCode": 401 }
```

---

## 3. Get Profile — One to One (JWT Guard)
```bash
curl -X GET http://localhost:3000/admin/profile \
  -H "Authorization: Bearer <token>"
```
✅ `200`
```json
{
  "id": "ADM-123456",
  "email": "admin@fittrack.com",
  "isActive": true,
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

## 4. Update Profile — One to One (JWT Guard)
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
✅ `200`
```json
{ "id": 1, "fullName": "Updated Admin", "phone": "01999888777", "country": "Bangladesh" }
```
❌ Profile not found `404`
```json
{ "message": "Profile not found", "statusCode": 404 }
```

---

## 5. Create Trainer — One to Many + BCrypt (JWT Guard)
```bash
curl -X POST http://localhost:3000/admin/trainers \
  -H "Authorization: Bearer <token>" \
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
  "isActive": true
}
```
❌ Duplicate email `409`
```json
{ "message": "Trainer with this email already exists", "statusCode": 409 }
```
❌ Invalid phone `400`
```json
{ "message": ["Phone number must start with 01"], "statusCode": 400 }
```

---

## 6. Get All Trainers — One to Many (JWT Guard)
```bash
curl -X GET http://localhost:3000/admin/trainers \
  -H "Authorization: Bearer <token>"
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
    "createdBy": {
      "id": "ADM-123456",
      "email": "admin@fittrack.com"
    }
  }
]
```

---

## 7. Delete Trainer — TypeORM (JWT Guard)
```bash
curl -X DELETE http://localhost:3000/admin/trainers/1 \
  -H "Authorization: Bearer <token>"
```
✅ `200`
```json
{ "message": "Trainer 1 deleted successfully" }
```
❌ Not found `404`
```json
{ "message": "Trainer with ID 1 not found", "statusCode": 404 }
```

---

## Testing Order
```
1. POST /admin/auth/register  → check email inbox for welcome mail
2. POST /admin/auth/login     → copy access_token
3. GET  /admin/profile        → confirm One to One relationship loads
4. PUT  /admin/profile        → update profile fields
5. POST /admin/trainers       → creates trainer linked to your admin (One to Many)
6. GET  /admin/trainers       → confirm createdBy admin shown in response
7. DELETE /admin/trainers/1   → delete the trainer
```