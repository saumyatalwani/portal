import { PrismaClient, Prisma } from "@/app/generated/prisma";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export { Prisma };
export default prisma;
