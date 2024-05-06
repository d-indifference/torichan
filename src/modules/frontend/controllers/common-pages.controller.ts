import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class CommonPagesController {
  constructor() {}

  @Get('/')
  @Render('index')
  public index(): void {}
}
