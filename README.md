# Framez — social image sharing (Expo + Supabase)

A lightweight social app built with Expo (React Native + expo-router) and Supabase. It demonstrates
authentication, profile management, image upload to Supabase Storage, and a simple feed with posts.

This README documents how to run, configure and build the app, plus notes for the common issues you
might encounter during development.

## Quick start

1.  Install dependencies

```powershell
npm install
# or if you use pnpm (repo uses pnpm lockfile):
pnpm install
```

2.  Create a `.env` file with your Supabase values (see "Environment variables" below)

3.  Start the dev server

```powershell
npx expo start
# or use the npm scripts
npm run start
```

4.  Open on device/emulator from the Metro UI or use the shortcut commands:

```powershell
npm run android
npm run ios
npm run web
```

## Project overview

- Framework: Expo (React Native), expo-router (file-based routing)
- Backend: Supabase (auth, postgres, storage)
- Styling: Tailwind via NativeWind
- Storage: Supabase Storage (bucket: images)

Core features implemented

- Sign up / sign in with email
- User profiles (username, avatar_url, email)
- Create posts with caption + optional image
- Feed of posts with author and timestamps

## Environment variables

Create a `.env` (not committed) in the repo root containing:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
```

Note: `app.config.js` injects these values into `expo.extra` at runtime so the app can access them via `Constants.expoConfig.extra` or process env during builds. Keep keys secret (don't commit them).

## Important scripts

- `npm run start` / `npx expo start` — start Metro dev server
- `npm run android` / `npm run ios` / `npm run web` — start on specific platform
- `npm run lint` — run linter
- `npm run reset-project` — helper included by the starter (move starter code aside)

The repo has a `pnpm-lock.yaml` (uses pnpm); you can use `pnpm` if you prefer.

## Folder structure (important files)

- `app/` — main route components (expo-router). Key routes:
  - `app/(auth)/register.tsx`, `app/(auth)/login.tsx` — auth flows
  - `app/(tabs)/feed.tsx` — main feed
  - `app/(tabs)/create.tsx` — create post
  - `app/(tabs)/profile.tsx` — user profile
  - `app/_layout.tsx` or `(tabs)/_layout.tsx` — navigation/tab layout
- `components/` — reusable components (Avatar, Post, Auth context)
- `lib/supabase.ts` — Supabase client and helpers (image upload)
- `assets/images/` — icons and splash resources

## Supabase schema notes

The app expects the following (common) setup in Supabase:

- Table `profiles` (columns used): `id` (uuid, PK), `username`, `avatar_url`, `email`, `created_at`
- Table `posts` (columns used): `id`, `caption`, `image_url`, `user_id` (fk to profiles.id), `created_at`
- Storage bucket `images` for user-post and avatar uploads.

When uploading images the app stores them in `images` and uses `getPublicUrl` to show them.

## Building with EAS

If you use EAS for builds, ensure the following are set in `app.config.js`:

- `expo.android.package` — your Android package id (e.g. `com.example.app`)
- `expo.extra.eas.projectId` — the EAS project id (if you want to pin it)

Use the EAS CLI to configure and build:

```powershell
npx eas build:configure
npx eas build --platform android --profile preview
```

If linking fails, see the troubleshooting steps in the project root or your EAS project settings.

## Contributions

Contributions are welcome. If you plan to make changes:

- Open a PR with a clear description of the change
- Keep UI changes isolated and add notes in this README

## License

This project is provided as-is. Add your license file here if needed.

---

If you'd like, I can also:

- Add a small CONTRIBUTE.md with development notes
- Add a script that validates the required env variables before start
- Add a small `./scripts/check-env.js` that prints missing env vars

Tell me if you'd like any of the above added.

### Built with 💜 by Aluminate
