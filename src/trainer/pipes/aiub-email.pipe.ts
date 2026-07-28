import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class AiubEmailValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (typeof value === 'string') {
      if (!emailRegex.test(value)) {
        throw new BadRequestException('Email Address field must be a valid email format');
      }
      return value.trim().toLowerCase();
    }

    if (value && typeof value === 'object' && value.email) {
      const email = String(value.email);
      if (!emailRegex.test(email)) {
        throw new BadRequestException('Email Address field must be a valid email format');
      }
      value.email = email.trim().toLowerCase();
    }

    return value;
  }
}
