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
