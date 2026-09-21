import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateParticipantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
