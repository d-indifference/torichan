import { Body, Controller, Get, Post, Query, Render, Res, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { Roles } from '@admin/decorators';
import { UserRole } from '@prisma/client';
import { SessionGuard } from '@admin/guards';
import { SessionDto, SqlQueryDto, SqlQueryOutputDto } from '@admin/dto';
import { SqlConsoleService } from '@admin/services';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';

@Controller('admin/sql')
export class SqlConsoleController {
  constructor(private readonly sqlConsoleService: SqlConsoleService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @Render('admin_sql-console')
  public async getSqlConsolePage(@Session() session: SessionDto, @Query('query') query?: string): Promise<SqlQueryOutputDto> {
    const queryResult = query ? await this.sqlConsoleService.runQuery(query) : null;

    return { session: session.payload, query: query ?? null, queryResult };
  }

  @Post()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public runSql(@Body(new ValidationPipe()) dto: SqlQueryDto, @Res() res: Response): void {
    res.redirect(`/admin/sql?query=${dto.query}`);
  }
}