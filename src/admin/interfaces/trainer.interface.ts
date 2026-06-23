export interface Trainer {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  specialty?: string;
  bio?: string;
  experience_years?: number;
  certification?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  classesAssigned: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  target_role?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}