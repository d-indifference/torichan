import {
  IsEnum,
  IsInt,
  IsIP,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export enum BanDurationType {
  MINUTES = 'MINUTES',
  HOURS = 'HOURS',
  DAYS = 'DAYS',
  MONTHS = 'MONTHS',
  YEARS = 'YEARS'
}

export class BanCreateDto {
  @IsIP()
  @IsNotEmpty()
  ip: string;

  @IsNumberString()
  @IsNotEmpty()
  till: string;

  @IsEnum(BanDurationType)
  @IsNotEmpty()
  durationType: BanDurationType;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(512)
  reason: string;
}
