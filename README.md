# equilibria-y2-group-project

SETUP:

- Install Android Studio/Sdk + Emulator
- Install npm+yarn
- Run `yarn` in root folder
- Set up `.env.local` in `apps/equilibria` & run `npx convex dev` and to set up Convex
- In `apps/equilibria` run `yarn expo prebuild` & `npx expo run:android` & `yarn android` (or `ios` maybe??)
- - Run `npm install --global eas-cli` and in `apps/equilibria`

Extra steps for Windows:
You would likely have to increase max absolute filepath char limit.

- run in PowerShell as administrator `New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force` to set LongPathEnabled to 1
- Update SDK's Ninja at `C:\Users\Your username\AppData\Local\Android\Sdk\cmake\3.22.1\bin\ninja.exe` to latest version

STACK:

- Yarn => Package manager
- Expo Router => React Native wrapper
- Tamagui => UI Components
- Convex => Fullstack backend, DB, Auth, etc.
- FlashList => Better performance lists
- Valibot => [Standard Schema](https://github.com/standard-schema/standard-schema)-compliant schema validator library of choice
- t3-env => typesafe .env configurations
- zustand => frontent state management
- ts-belt, ts-pattern => FP-like utility