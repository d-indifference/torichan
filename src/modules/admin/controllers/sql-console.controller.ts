import { Body, Controller, Get, ParseBoolPipe, Post, Query, Render, Res, Session, StreamableFile, UseGuards, ValidationPipe } from '@nestjs/common';
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
  public async getSqlConsolePage(
    @Session() session: SessionDto,
    @Query('query') query?: string,
    @Query('runAsMutation', new ParseBoolPipe({ optional: true })) runAsMutation?: boolean
  ): Promise<SqlQueryOutputDto> {
    const queryResult = query ? await this.sqlConsoleService.runQuery(query, runAsMutation) : null;

    return { session: session.payload, query: query ?? null, queryResult };
  }

  @Post()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public runSql(@Body(new ValidationPipe()) dto: SqlQueryDto, @Res() res: Response): void {
    let redirectString = `/admin/sql?query=${dto.query}`;

    if (dto.runAsMutation) {
      redirectString += '&runAsMutation=true';
    }

    res.redirect(redirectString);
  }

  @Post('save')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async saveSqlQuery(@Body(new ValidationPipe()) dto: SqlQueryDto, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    return await this.sqlConsoleService.saveToFile(dto.query, res);
  }
}
