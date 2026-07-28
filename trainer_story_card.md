# 🏋️ Trainer Role - User Story Card (8 Routes)

---

## 📌 1. Who is the Trainer?
The **Trainer** in the FitTrack Gym Management System leads training sessions, updates class schedules, maintains profile credentials, and communicates with members via Google SMTP email.

---

## 📖 2. 8 Agile User Story Cards

1. **Auth Signup** (`POST /trainer/auth/register`):
   - *As a Trainer, I want to register with any valid email and password, so that my account is stored with BCrypt password encryption.*

2. **Auth Login** (`POST /trainer/auth/login`):
   - *As a Trainer, I want to log in with my credentials, so that I receive a signed JWT access token.*

3. **Get Classes** (`GET /trainer/classes`):
   - *As a Trainer, I want to view paginated class lists with status filters, so that I can track upcoming classes.*

4. **Schedule Class** (`POST /trainer/classes`):
   - *As a Trainer, I want to schedule a new class session with room and capacity limits, so that members can see upcoming sessions.*

5. **Update Profile** (`PUT /trainer/profile`):
   - *As a Trainer, I want to update my profile and specialization, so that my public profile reflects my qualifications.*

6. **Update Class** (`PATCH /trainer/classes/:id`):
   - *As a Trainer, I want to update class room assignments or capacity, so that schedules adapt dynamically.*

7. **Cancel Class** (`DELETE /trainer/classes/:id`):
   - *As a Trainer, I want to cancel a class session by ID, so that cancelled sessions are removed from the schedule.*

8. **Google SMTP Mailer** (`POST /trainer/mail/send-schedule`):
   - *As a Trainer, I want to send schedule update emails to members via Google SMTP, so that members receive notifications in their inbox.*
