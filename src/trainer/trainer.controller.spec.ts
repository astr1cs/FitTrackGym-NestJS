import { Test, TestingModule } from '@nestjs/testing';
import { TrainerController } from './trainer.controller';
import { TrainerService } from './trainer.service';

describe('TrainerController', () => {
  let controller: TrainerController;
  let service: TrainerService;

  const mockTrainerService = {
    getClasses: jest.fn().mockImplementation(() => ({
      data: [
        {
          id: 'class_1',
          name: 'Yoga Flow',
          trainerId: 'trainer_1',
          startTime: '2026-06-24T22:00:00.000Z',
          endTime: '2026-06-24T23:00:00.000Z',
          room: 'Studio A',
          maxCapacity: 15,
          status: 'scheduled',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    })),
    createClass: jest.fn().mockImplementation((dto) => ({
      message: 'Class scheduled successfully',
      class: { id: 'class_3', ...dto, status: 'scheduled' },
    })),
    getClassById: jest.fn().mockImplementation((id) => ({
      id,
      name: 'Yoga Flow',
      status: 'scheduled',
    })),
    updateClass: jest.fn().mockImplementation((id, dto) => ({
      message: 'Class updated successfully',
      class: { id, ...dto },
    })),
    deleteClass: jest.fn().mockImplementation(() => ({
      message: 'Class deleted successfully',
    })),
    recordAttendance: jest.fn().mockImplementation((classId, dto) => ({
      message: 'Attendance recorded successfully',
      record: { id: 'att_1', classId, ...dto },
    })),
    getAttendance: jest.fn().mockImplementation((classId) => ({
      classId,
      className: 'Yoga Flow',
      records: [],
    })),
    getClients: jest.fn().mockImplementation(() => ({
      data: [{ id: 'member_1', name: 'Sarah Johnson' }],
      total: 1,
    })),
    register: jest.fn().mockImplementation((dto) => ({
      message: 'Trainer registered successfully',
      trainer: { id: 'trainer_1', ...dto },
    })),
    login: jest.fn().mockImplementation(() => ({
      message: 'Login successful',
      access_token: 'mock_jwt_token',
    })),
    sendScheduleMail: jest.fn().mockImplementation(() => ({
      success: true,
      message: 'Schedule notification email sent via Google SMTP',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainerController],
      providers: [
        {
          provide: TrainerService,
          useValue: mockTrainerService,
        },
      ],
    }).compile();

    controller = module.get<TrainerController>(TrainerController);
    service = module.get<TrainerService>(TrainerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return list of classes', async () => {
    const result = await controller.getClasses('scheduled', 1, 10);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Yoga Flow');
  });

  it('should create a new class', async () => {
    const dto = {
      name: 'Spinning Class',
      trainerId: 'trainer_1',
      startTime: '2026-06-25T10:00:00.000Z',
      endTime: '2026-06-25T11:00:00.000Z',
      room: 'Studio C',
      maxCapacity: 12,
    };
    const result = await controller.createClass(dto as any);
    expect(result.message).toBe('Class scheduled successfully');
    expect(result.class.name).toBe('Spinning Class');
  });

  it('should record attendance', async () => {
    const dto = {
      memberId: 'member_1',
      memberName: 'Sarah Johnson',
      status: 'present' as const,
    };
    const result = await controller.recordAttendance('class_1', dto);
    expect(result.message).toBe('Attendance recorded successfully');
  });

  it('should send schedule notification mail', async () => {
    const dto = {
      recipientEmail: 'member@example.com',
      subject: 'Yoga Session',
      messageContent: 'Your class starts at 10 AM',
    };
    const result = await controller.sendScheduleMail(dto);
    expect(result.success).toBe(true);
  });
});
