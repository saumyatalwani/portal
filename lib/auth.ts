import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
//import { nextCookies } from "better-auth/next-js";
import { apiKey } from "better-auth/plugins"

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 4,
  },
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  plugins: [
    apiKey(),  // ✅ no rate limit config
    //nextCookies(),
  ],
});
