# eds-app

- [TypeScript](https://www.typescriptlang.org/)
- [Nuxt 3](https://nuxt.com)
- Tailwind CSS
- Naive UI
- Prisma ORM
- tRPC 10
- nuxt-auth
- i18n
- Linting via ESLint and @antfu/eslint-config

### Prepare

- Install [PostgresSQL](https://www.postgresql.org/download/)
- Install [NodeJS (v20.14.0)](https://nodejs.org/dist/v20.14.0/)

### Setup

Make sure to install the dependencies:

```bash
npm install
```

Make migrate on database:

```bash
npx prisma db push
```

### Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```
