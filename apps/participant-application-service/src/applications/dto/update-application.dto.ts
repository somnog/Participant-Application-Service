import { IsOptional, IsString, IsEnum } from 'class-validator';

enum ApplicationStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
  enrolled = 'enrolled',
}

export class UpdateApplicationDto {
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsString()
  workshopId?: string;

  @IsOptional()
  @IsString()
  track?: string;
}
