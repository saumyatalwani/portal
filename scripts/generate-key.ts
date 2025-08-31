import { auth } from "../lib/auth";

async function main() {
    const userId = process.env.ADMIN_USER_ID;
    if (!userId) {
    throw new Error("❌ ADMIN_USER_ID not set in .env");
    }

    const data = await auth.api.createApiKey({
        body: {
        name: "github-ci",
        prefix: "ci_",
        userId: userId,
        permissions: { codechef: ["read"], leetcode : ["read"], codeforces : ["read"]},
        rateLimitEnabled: true,
        rateLimitMax: 5,
        rateLimitTimeWindow: 86400
        },
    });

    console.log("Your CI API Key:", data?.key);
    console.log("⚠️ Store this in GitHub Secrets, it will never be shown again.");
}

main();
