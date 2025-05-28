# equilibria-y2-group-project

SETUP:

- Install Android Studio/Sdk + Emulator
- Install npm+yarn
- Run `yarn` in root folder
- Set up `.env.local` in `apps/equilibria` & run `npx convex dev` and to set up Convex
- In `apps/equilibria` run `yarn expo prebuild` & `yarn expo android` (or `ios` maybe??)

STACK:

- Yarn => Package manager
- Expo Router => React Native wrapper
- Tamagui => UI components
- FlashList => Better performance lists
- Valibot => [Standard Schema](https://github.com/standard-schema/standard-schema)-compliant schema validator library of choice
- t3-env => typesafe .env configurations
- Convex => Fullstack backend, DB, Auth, etc.

---

TO SORT:

- Zustand (maybe)
- T4 Stack
- - Supabase Auth
- - Drizzle
- - tRPC
- - Hono
- - Million.js
- - Virtualized Lists
- - Pattycake + ts-pattern

- Clerk + Convex for Auth
- Drizzle maybe?? tRPC maybe?? Supabase Auth??
