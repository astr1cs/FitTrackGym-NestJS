# Operation 1: Create a user
curl -X POST http://localhost:3000/trainer/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Trainer",
    "age": 28,
    "status": "active"
  }'

# Operation 1 (with default status):
curl -X POST http://localhost:3000/trainer/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Bob Trainer",
    "age": 35
  }'

# Operation 2: Change the status of a user to either 'active' or 'inactive' (replace 1 with actual generated id)
curl -X PATCH http://localhost:3000/trainer/users/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'

# Operation 3: Retrieve a list of users based on status
# 3.1 Get active users
curl -X GET http://localhost:3000/trainer/users?status=active

# 3.2 Get inactive users
curl -X GET http://localhost:3000/trainer/users?status=inactive
