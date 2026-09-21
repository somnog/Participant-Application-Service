import { IsString, IsOptional, IsEnum } from 'class-validator';

enum ApplicationStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
  enrolled = 'enrolled',
}

export class CreateApplicationDto {
  @IsString()
  participantId: string;

  @IsOptional()
  @IsString()
  workshopId?: string;

  @IsOptional()
  @IsString()
  track?: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}
