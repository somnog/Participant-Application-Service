import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
