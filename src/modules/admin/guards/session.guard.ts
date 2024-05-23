import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@utils/services';
import { SessionDto } from '@admin/dto';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const session = req.session as SessionDto;

    if (session.payload !== undefined) {
      const user = await this.prisma.user.findUnique({ where: { id: session.payload.id } });

      if (user) {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!requiredRoles) {
          return true;
        }

        const userRole = session.payload.role;

        if (!userRole || !requiredRoles.includes(userRole)) {
          throw new ForbiddenException('You do not have permission to perform this action.');
        } else {
          return true;
        }
      } else {
        res.redirect('/admin/sign-in');
      }
    } else {
      res.redirect('/admin/sign-in');
    }
  }
}