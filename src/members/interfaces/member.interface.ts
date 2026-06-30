export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: string;
  fitness_goal?: string;
  nid?: string;
  nidImagePath?: string;
  membership: {
    plan: string;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'cancelled';
  };
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  member_id: string;
  class_id: string;
  class_name: string;
  trainer_name: string;
  date: string;
  time: string;
  status: 'booked' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show';
  created_at: string;
}

export interface Payment {
  id: string;
  member_id: string;
  amount: number;
  description: string;
  payment_method: string;
  status: 'pending' | 'paid' | 'failed';
  paid_at?: string;
  created_at: string;
}