import { PrismaClient, Prisma } from "@/generated/prisma";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// extend globalThis type
declare global {
  // allow global `var prismaGlobal` for development hot-reload
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | PrismaClient;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export { Prisma };
export default prisma;
