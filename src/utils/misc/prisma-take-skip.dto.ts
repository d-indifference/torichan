export class PrismaTakeSkipDto {
  take?: number;

  skip?: number;

  constructor(take?: number, skip?: number) {
    this.take = take;
    this.skip = skip;
  }

  public toString(): string {
    return `{"take": ${this.take},"skip": ${this.skip}}`;
  }
}
