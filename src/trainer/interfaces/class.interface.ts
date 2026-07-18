export interface ClassSession {
  id: string;
  name: string;
  trainerId: string;
  startTime: string;
  endTime: string;
  room?: string;
  maxCapacity: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  memberId: string;
  memberName: string;
  status: 'present' | 'absent';
  recorded_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
}

// Lab Task 2 — Pipes: Category 2 — trainer's own self-service profile record
export interface TrainerProfile {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  gender?: 'male' | 'female';
  updated_at: string;
}