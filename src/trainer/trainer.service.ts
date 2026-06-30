import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { UpdateTrainerProfileDto } from './dto/update-trainer-profile.dto';
import { ClassSession, AttendanceRecord, Client, TrainerProfile } from './interfaces/class.interface';

const classSessions: ClassSession[] = [];
const attendanceRecords: AttendanceRecord[] = [];
const clients: Client[] = [];
let classIdCounter = 1;
let attendanceIdCounter = 1;

// Lab Task 2 — Pipes: Category 2 — mock record for the logged-in trainer's own profile
const trainerProfile: TrainerProfile = {
  id: 'trainer_1',
  name: 'Alex Carter',
  email: 'alex.carter@aiub.edu',
  password: 'Coach123',
  phone: '01711223344',
  gender: 'male',
  updated_at: new Date().toISOString(),
};

// Seed initial mock data
if (clients.length === 0) {
  clients.push(
    { id: 'member_1', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '555-0199', joinedDate: new Date().toISOString() },
    { id: 'member_2', name: 'Mike Brown', email: 'mike.b@example.com', phone: '555-0188', joinedDate: new Date().toISOString() },
    { id: 'member_3', name: 'Alice Davis', email: 'alice.d@example.com', phone: '555-0177', joinedDate: new Date().toISOString() }
  );
}

if (classSessions.length === 0) {
  classSessions.push(
    {
      id: `class_${classIdCounter++}`,
      name: 'Yoga Flow',
      trainerId: 'trainer_1',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      room: 'Studio A',
      maxCapacity: 15,
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: `class_${classIdCounter++}`,
      name: 'HIIT Workout',
      trainerId: 'trainer_1',
      startTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 49 * 60 * 60 * 1000).toISOString(),
      room: 'Studio B',
      maxCapacity: 20,
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );
}

@Injectable()
export class TrainerService {
  // Route 1: Get all classes (GET /trainer/classes)
  getClasses(filters: { status?: string; page?: number; limit?: number }) {
    let filteredClasses = [...classSessions];

    if (filters.status) {
      filteredClasses = filteredClasses.filter(
        c => c.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: filteredClasses.slice(startIndex, endIndex),
      total: filteredClasses.length,
      page,
      limit,
      totalPages: Math.ceil(filteredClasses.length / limit),
    };
  }

  // Route 2: Create/schedule a class session (POST /trainer/classes)
  createClass(createClassDto: CreateClassDto) {
    // Check if class with same name and schedule already exists
    const duplicate = classSessions.find(
      c => c.name.toLowerCase() === createClassDto.name.toLowerCase() &&
           c.startTime === createClassDto.startTime
    );
    if (duplicate) {
      throw new ConflictException('Class scheduled at this time already exists');
    }

    const newClass: ClassSession = {
      id: `class_${classIdCounter++}`,
      name: createClassDto.name,
      trainerId: createClassDto.trainerId,
      startTime: createClassDto.startTime,
      endTime: createClassDto.endTime,
      room: createClassDto.room || 'General Area',
      maxCapacity: createClassDto.maxCapacity || 10,
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    classSessions.push(newClass);

    return {
      message: 'Class scheduled successfully',
      class: newClass,
    };
  }

  // Route 3: Get single class details (GET /trainer/classes/:id)
  getClassById(id: string) {
    const classSession = classSessions.find(c => c.id === id);
    if (!classSession) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return classSession;
  }

  // Route 4: Update class session details (PUT /trainer/classes/:id)
  updateClass(id: string, updateClassDto: UpdateClassDto) {
    const index = classSessions.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    const updatedClass: ClassSession = {
      ...classSessions[index],
      ...updateClassDto,
      updated_at: new Date().toISOString(),
    };

    classSessions[index] = updatedClass;

    return {
      message: 'Class updated successfully',
      class: updatedClass,
    };
  }

  // Route 5: Cancel/delete class session (DELETE /trainer/classes/:id)
  deleteClass(id: string) {
    const index = classSessions.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    classSessions.splice(index, 1);
    return {
      message: 'Class deleted successfully',
    };
  }

  // Route 6: Record attendance for a class session (POST /trainer/classes/:classId/attendance)
  recordAttendance(classId: string, recordAttendanceDto: RecordAttendanceDto) {
    // Check if class exists
    const classSession = classSessions.find(c => c.id === classId);
    if (!classSession) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    // Check if attendance already recorded for this member in this class
    const existingIndex = attendanceRecords.findIndex(
      r => r.classId === classId && r.memberId === recordAttendanceDto.memberId
    );

    const newRecord: AttendanceRecord = {
      id: `att_${attendanceIdCounter++}`,
      classId,
      memberId: recordAttendanceDto.memberId,
      memberName: recordAttendanceDto.memberName,
      status: recordAttendanceDto.status,
      recorded_at: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      attendanceRecords[existingIndex] = newRecord;
    } else {
      attendanceRecords.push(newRecord);
    }

    return {
      message: 'Attendance recorded successfully',
      record: newRecord,
    };
  }

  // Route 7: Get attendance roster for a class session (GET /trainer/classes/:classId/attendance)
  getAttendance(classId: string) {
    // Check if class exists
    const classSession = classSessions.find(c => c.id === classId);
    if (!classSession) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    const records = attendanceRecords.filter(r => r.classId === classId);
    return {
      classId,
      className: classSession.name,
      records,
    };
  }

  // Route 8: View client roster (GET /trainer/clients)
  getClients() {
    return {
      data: clients,
      total: clients.length,
    };
  }

  // Route 9: Get own profile (GET /trainer/profile)
  getProfile() {
    const { password, ...profileWithoutPassword } = trainerProfile;
    return profileWithoutPassword;
  }

  // Route 10: Update own profile (PATCH /trainer/profile)
  // Lab Task 2 — Pipes: Category 2 rules validated via UpdateTrainerProfileDto
  updateProfile(updateTrainerProfileDto: UpdateTrainerProfileDto) {
    Object.assign(trainerProfile, updateTrainerProfileDto, {
      updated_at: new Date().toISOString(),
    });

    const { password, ...profileWithoutPassword } = trainerProfile;

    return {
      message: 'Profile updated successfully',
      profile: profileWithoutPassword,
    };
  }

  // Helper method for testing
  getAllClasses() {
    return classSessions;
  }
}