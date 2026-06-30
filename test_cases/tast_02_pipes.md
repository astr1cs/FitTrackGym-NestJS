# Pipes — Quick Test Guide

## 1. Admin — Create Trainer (Category 3)
File upload required, so use Postman form-data (curl shown for reference, use `-F` not `-d`):

```bash
curl -X POST http://localhost:3000/admin/trainers \
  -F "name=John Smith" \
  -F "email=john.smith@example.com" \
  -F "password=secret1" \
  -F "phone=01789456123" \
  -F "certificateFile=@/path/to/file.pdf;type=application/pdf"
```

**Rules:** name = no special chars · password = min 6 + lowercase · phone = starts with `01` · certificateFile = must be PDF, ≤5MB

**Error example** (`name: "John@Smith!"`)
```json
{ "message": ["Name must not contain special characters"], "error": "Bad Request", "statusCode": 400 }
```

---

## 2. Trainer — Update Profile (Category 2)

```bash
curl -X PATCH http://localhost:3000/trainer/profile \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.carter@aiub.edu",
    "password": "NewPass1",
    "gender": "male",
    "phone": "01711223344"
  }'
```

**Rules:** email = must be `aiub.edu` · password = min 6 + uppercase · gender = `male`/`female` · phone = numbers only

**Error example** (`email: "alex@gmail.com"`)
```json
{ "message": ["Email must be an aiub.edu address"], "error": "Bad Request", "statusCode": 400 }
```

---

## 3. Member — Update Profile (Category 1)
File upload required, so use Postman form-data (curl shown for reference, use `-F` not `-d`):

```bash
curl -X PUT http://localhost:3000/members/profile \
  -F "name=Jane Doe" \
  -F "email=jane.doe@example.xyz" \
  -F "nid=1234567890" \
  -F "nidImage=@/path/to/photo.jpg;type=image/jpeg"
```

**Rules:** name = alphabets only · email = must be `.xyz` · nid = 10/13/17 digits · nidImage = ≤2MB

**Error example** (`nid: "12345"`)
```json
{ "message": ["NID must be a valid 10, 13, or 17 digit number"], "error": "Bad Request", "statusCode": 400 }
```

---

**In Postman:** routes with `-F` need Body → form-data (key/value, set file fields to type File). The route with `-d`/JSON needs Body → raw → JSON, paste the object directly. File errors return `422`, DTO field errors return `400`.