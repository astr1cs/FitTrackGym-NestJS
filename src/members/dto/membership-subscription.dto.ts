import { IsNotEmpty, IsString } from 'class-validator';

export class MembershipSubscriptionDto {
  @IsNotEmpty({ message: 'Plan ID is required' })
  @IsString()
  plan_id: string;
}