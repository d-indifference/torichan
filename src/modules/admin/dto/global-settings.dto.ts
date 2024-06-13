import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GlobalSettingsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(256)
  siteName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(512)
  siteSlogan: string;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
  siteNavbar: string;

  @IsString()
  @IsNotEmpty()
  faqPage: string;

  @IsString()
  @IsNotEmpty()
  rulesPage: string;

  constructor(siteName: string, siteSlogan: string, siteNavbar: string, faqPage: string, rulesPage: string) {
    this.siteName = siteName;
    this.siteSlogan = siteSlogan;
    this.siteNavbar = siteNavbar;
    this.faqPage = faqPage;
    this.rulesPage = rulesPage;
  }
}
