import { IsArray, IsString, IsEnum } from 'class-validator';

enum ApplicationStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
  enrolled = 'enrolled',
}

export class BulkStatusDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];

  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
