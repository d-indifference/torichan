import { Board } from '@prisma/client';

export class BoardDto {
  id: string;

  slug: string;

  name: string;

  constructor(id: string, slug: string, name: string) {
    this.id = id;
    this.slug = slug;
    this.name = name;
  }

  public static fromModel(model: Board): BoardDto {
    return new BoardDto(model.id, model.slug, model.name);
  }
}
