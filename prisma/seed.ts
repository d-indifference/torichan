import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seed = async (): Promise<void> => {
  const board1 = await prisma.board.create({ data: { slug: 'b', name: 'Random' } });
  const board2 = await prisma.board.create({ data: { slug: 'a', name: 'Anime' } });
  const board3 = await prisma.board.create({ data: { slug: 'vg', name: 'Video games' } });

  console.log({ board1, board2, board3 });
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
