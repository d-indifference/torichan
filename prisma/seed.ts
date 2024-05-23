import { PrismaClient, UserRole } from '@prisma/client';
import { CryptoUtils } from '../src/utils/misc/crypto-utils';

const prisma = new PrismaClient();

const seed = async (): Promise<void> => {
  const insecureKey: string = 'insecure-a3253b30-0fa4-4dd0-83b8-5fc6e0b31592';

  const user1 = await prisma.user.create({
    data: {
      username: 'root',
      encryptedPassword: new CryptoUtils(insecureKey).encrypt('root'),
      email: 'root@toor.com',
      role: UserRole.ADMINISTRATOR
    }
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'moder1',
      encryptedPassword: new CryptoUtils(insecureKey).encrypt('moder1'),
      email: 'moder1@toor.com',
      role: UserRole.MODERATOR
    }
  });

  console.log({ user1, user2 });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
