import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class AiubEmailValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      if (!value.includes('@') || !value.endsWith('aiub.edu')) {
        throw new BadRequestException(
          'Email Address field is required, and input must contain aiub.edu domain',
        );
      }
      return value.trim().toLowerCase();
    }

    if (value && typeof value === 'object' && value.email) {
      const email = String(value.email);
      if (!email.includes('@') || !email.endsWith('aiub.edu')) {
        throw new BadRequestException(
          'Email Address field is required, and input must contain aiub.edu domain',
        );
      }
      value.email = email.trim().toLowerCase();
    }

    return value;
  }
}
