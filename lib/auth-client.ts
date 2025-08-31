'use client';

import { createAuthClient } from "better-auth/react"
import { apiKeyClient } from "better-auth/client/plugins"


export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins:[apiKeyClient()]
})

export const { signIn, signUp, useSession } = createAuthClient()