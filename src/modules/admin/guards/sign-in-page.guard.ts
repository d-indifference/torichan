import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@utils/services';
import { SessionDto } from '@admin/dto';
import { Response } from 'express';

@Injectable()
export class SignInPageGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const session = req.session as SessionDto;

    if (session.payload !== undefined) {
      const user = await this.prisma.user.findUnique({ where: { id: session.payload.id } });

      if (user) {
        res.status(HttpStatus.FOUND).redirect('/admin');
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}
