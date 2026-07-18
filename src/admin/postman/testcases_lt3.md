# Operation 1: Create a user
curl -X POST http://localhost:3000/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "phone": 1711223344,
    "isActive": true
  }'

# Operation 1 (with fullName):
curl -X POST http://localhost:3000/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Admin",
    "phone": 1711223344,
    "isActive": true
  }'

# Operation 2: Modify phone number (replace ADM-XXXXXX with actual generated id)
curl -X PATCH http://localhost:3000/admin/users/ADM-XXXXXX/phone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": 1999888777
  }'

# Operation 3: Retrieve users with null fullName
curl -X GET http://localhost:3000/admin/users/null-fullname

# Operation 4: Remove a user by id
curl -X DELETE http://localhost:3000/admin/users/ADM-XXXXXX