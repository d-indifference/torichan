import { Prisma } from '@prisma/client';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class BoardUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(256)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  name?: string;

  public toUpdateInput(): Prisma.BoardUpdateInput {
    const input: Record<string, unknown> = {};

    if (this.slug) {
      input['slug'] = this.slug;
    }

    if (this.name) {
      input['name'] = this.name;
    }

    return input as Prisma.BoardUpdateInput;
  }

  public toString(): string {
    return `{"slug": "${this.slug}","name":"${this.name}"}`;
  }
}
