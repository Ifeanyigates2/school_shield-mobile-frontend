# SchoolShield Android app

Native Android client for [SchoolShield](https://school-shield.vercel.app) — live 15-minute drop-off and pick-up codes, attendance that follows verification, and desks for parents, teachers, school/bus admins, and super admins.

The app talks to the same Next.js APIs as the website (`/api/auth/*`, `/api/state`, `/api/mutate`) and keeps the `ss_session` / `ss_pending` cookies on the device.

## Open in Android Studio

1. Install [Android Studio](https://developer.android.com/studio) (this project needs JDK 17; Android Studio’s bundled JBR is enough).
2. **File → Open** and choose this folder: `Schoolshield mobile app`.
3. Wait for Gradle sync, then run on an emulator or a phone.

Default server: `https://school-shield.vercel.app`. Change it in **More → Server & settings** if you are hitting a local Next.js server (`http://10.0.2.2:3000` on the emulator, or your computer’s LAN IP on a real phone).

## Demo desks

| Role | Email | What they do |
| --- | --- | --- |
| Parent | `ada@greenfield.school` | Generate gate codes |
| Teacher | `folake@greenfield.school` | Class register and notes |
| Admin | `tunde@greenfield.school` | Verify codes at the gate |
| Super admin | `ngozi@greenfield.school` | School-wide reports |

Password: `SchoolShield1`  
OTP: `000000`

## What is included

- Sign in, sign up (role + phone required), Google/Facebook continue dialog, OTP, onboarding
- Parent: live codes, children, attendance, delegates, incidents, messages
- Teacher: register, late alerts, daily notes, substitute cover
- Admin: 6-digit gate keypad, delegate approval, verification log
- Super admin: command centre, people directory, attendance, incidents

## Command-line build

```bash
cd "Schoolshield mobile app"
./gradlew assembleDebug
```

The APK lands at `app/build/outputs/apk/debug/app-debug.apk`.
