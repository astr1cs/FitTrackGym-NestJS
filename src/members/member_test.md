Test Sequence Commands
1. Get Profile

bash
curl -X GET http://localhost:3000/members/profile
2. Update Profile

bash
curl -X PUT http://localhost:3000/members/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "phone": "+9876543210",
    "fitness_goal": "Muscle Building"
  }'
3. Get Membership Plans

bash
curl -X GET http://localhost:3000/members/membership-plans
4. Subscribe to Plan

bash
curl -X POST http://localhost:3000/members/membership/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "plan_2"
  }'
5. Browse Classes (with filters)

bash
# All classes
curl -X GET http://localhost:3000/members/classes

# With search
curl -X GET "http://localhost:3000/members/classes?search=Yoga"

# With date filter
curl -X GET "http://localhost:3000/members/classes?date=2026-06-24"

# With pagination
curl -X GET "http://localhost:3000/members/classes?page=1&limit=5"
6. Get Class Details

bash
curl -X GET http://localhost:3000/members/classes/class_1
7. Book a Class

bash
curl -X POST http://localhost:3000/members/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "class_id": "class_1"
  }'
8. Get Member Bookings

bash
curl -X GET http://localhost:3000/members/bookings
9. Cancel Booking

bash
curl -X DELETE http://localhost:3000/members/bookings/booking_1
10. Get Payment History

bash
curl -X GET http://localhost:3000/members/payments