// global.d.ts
import { PrismaClient } from '@/app/generated/prisma';

/* eslint-disable no-var */
declare global {
  var prismaGlobal: PrismaClient | undefined;
}
/* eslint-enable no-var */

export {};
