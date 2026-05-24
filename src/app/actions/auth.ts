'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function setUserPassword(email: string, password: string) {
  const hash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { email },
    data: { passwordHash: hash },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
