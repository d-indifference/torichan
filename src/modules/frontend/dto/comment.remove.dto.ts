import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CommentRemoveDto {
  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  @IsInt({ each: true })
  @IsPositive({ each: true })
  delete: number[];

  @IsBoolean({ each: true })
  fileOnly: boolean;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(8)
  password: string;
}

export class CommentRemoveNotNormalizedDto {
  delete: string[] | string;

  fileOnly?: 'on' | undefined;

  password: string;
}
