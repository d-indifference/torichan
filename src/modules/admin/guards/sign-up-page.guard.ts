import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@utils/services';
import { Response } from 'express';

@Injectable()
export class SignUpPageGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const res: Response = context.switchToHttp().getResponse();

    const count = await this.prisma.user.count();

    if (count === 0) {
      return true;
    }

    res.status(HttpStatus.FOUND).redirect('/admin');
  }
}
