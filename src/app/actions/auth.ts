'use server';

import prisma from '@/lib/prisma';

export async function setUserPassword(email: string, password: string) {
  void email;
  void password;
  throw new Error('Password changes must use a verified reset flow.');
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, image: true, avatar: true, role: true, status: true },
  });
}
