import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { LOCALE } from '@utils/locale';

export class GlobalSettingsDto {
  @IsString(LOCALE.validators['isString']('siteName'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('siteName'))
  @MinLength(3, LOCALE.validators['minLength']('siteName', 3))
  @MaxLength(256, LOCALE.validators['maxLength']('siteName', 256))
  siteName: string;

  @IsString(LOCALE.validators['isString']('siteSlogan'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('siteSlogan'))
  @MinLength(3, LOCALE.validators['minLength']('siteSlogan', 3))
  @MaxLength(512, LOCALE.validators['maxLength']('siteSlogan', 512))
  siteSlogan: string;

  @IsString(LOCALE.validators['isString']('siteNavbar'))
  @IsOptional()
  siteNavbar: string;

  @IsString(LOCALE.validators['isString']('menuFrame'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('menuFrame'))
  menuFrame: string;

  @IsString(LOCALE.validators['isString']('startPage'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('startPage'))
  startPage: string;

  @IsString(LOCALE.validators['isString']('faqPage'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('faqPage'))
  faqPage: string;

  @IsString(LOCALE.validators['isString']('rulesPage'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('rulesPage'))
  rulesPage: string;

  constructor(siteName: string, siteSlogan: string, siteNavbar: string, menuFrame: string, startPage: string, faqPage: string, rulesPage: string) {
    this.siteName = siteName;
    this.siteSlogan = siteSlogan;
    this.siteNavbar = siteNavbar;
    this.menuFrame = menuFrame;
    this.startPage = startPage;
    this.faqPage = faqPage;
    this.rulesPage = rulesPage;
  }
}
