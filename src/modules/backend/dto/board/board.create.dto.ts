import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BoardCreateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  public toCreateInput(): Prisma.BoardCreateInput {
    return { slug: this.slug, name: this.name };
  }

  public toString(): string {
    return `{"slug": "${this.slug}","name":"${this.name}"}`;
  }
}
