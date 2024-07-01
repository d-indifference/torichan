import { IsEnum, IsIP, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { LOCALE } from '@utils/locale';

export enum BanDurationType {
  MINUTES = 'MINUTES',
  HOURS = 'HOURS',
  DAYS = 'DAYS',
  MONTHS = 'MONTHS',
  YEARS = 'YEARS'
}

export class BanCreateDto {
  @IsIP('4', LOCALE.validators['isIp']('ip'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('ip'))
  ip: string;

  @IsNumberString(null, LOCALE.validators['isNumberString']('till'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('till'))
  till: string;

  @IsEnum(BanDurationType, LOCALE.validators['isEnum']('durationType'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('till'))
  durationType: BanDurationType;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('reason'))
  @MinLength(0, LOCALE.validators['minLength']('reason', 0))
  @MaxLength(512, LOCALE.validators['maxLength']('reason', 512))
  reason: string;
}
