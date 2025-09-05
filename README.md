# Portal

## Environment Variables

```bash
DATABASE_URL= #FOR PRISMA
BETTER_AUTH_SECRET= #FOR BETTER AUTH
BETTER_AUTH_URL= #FOR BETTER AUTH
NEXT_PUBLIC_BETTER_AUTH_URL= #FOR BETTER AUTH
ADMIN_USER_ID= #FOR CREATING API KEY
```

## Generating an API Key

Setup the repo and run :

```bash
npx tsx scripts/generate-key.ts
```