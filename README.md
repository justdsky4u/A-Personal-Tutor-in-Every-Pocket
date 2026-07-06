# A Personal Tutor in Every Pocket

## Mission
A Personal Tutor in Every Pocket is an education revolution engine designed to bring a patient, local, offline-capable AI tutor to underserved learners across communities.

### What this repo contains
- `mobile/` — cross-platform React Native app built with Expo
- `backend/` — lightweight Node.js sync server for user data and content updates
- `docs/` — architecture and product design guidance

### MVP Focus
- Chat-based AI tutor experience
- 3 starter subjects: Math, Science, Language
- Offline lessons, audio-first support, motivational coaching
- Local analogy mode with community-first examples

## Getting Started

### Mobile app
```bash
cd mobile
npm install
npm start
```

### Backend server
```bash
cd backend
npm install
npm run dev
```

## Vision
This engine is built to be:
- hyper-personalized
- culturally aware
- battery- and data-efficient
- easy for low-literacy users
- a bridge to income-generating skills

## Next Steps
1. Test on low-end devices
2. Collect local user feedback
3. Expand subject catalogs and vocational learning paths
4. Add sync between offline device and cloud

## Deployment
- Backend can be deployed on Vercel or Render.
- Mobile app is built as a cross-platform Expo client and can be distributed through APK/TestFlight or published later.

### GitHub Actions
This repo includes a CI workflow at `.github/workflows/ci.yml`.
1. Push or open a pull request to `main`.
2. GitHub Actions will install dependencies for both `backend` and `mobile`.
3. It also runs TypeScript checks for both packages.

### Render
This repo includes `render.yaml` and `Procfile` for easy Render deployment.
1. Create a Render account and connect your GitHub repository.
2. Choose "Web Service" and point to this repository.
3. Set the build command to: `cd backend && npm install`
4. Set the start command to: `cd backend && npm run dev`
5. Render will use `Procfile` if available and deploy the backend service.

### Vercel
The repo includes `vercel.json` with a Node.js backend route.
1. Create a Vercel account and import the repository.
2. Select the root of this repository as the project root.
3. Use the default build settings for a Node.js app.
4. Deploy and verify the `/health` endpoint.

## Deploy checklist
- [ ] Confirm `backend` and `mobile` both install cleanly on the target environment.
- [ ] Verify `backend/src/index.ts` responds correctly at `/health`.
- [ ] Check local onboarding persistence by restarting the app after profile selection.
- [ ] Validate `POST /sync-demo` returns a successful response.
- [ ] Ensure `vercel.json` or `render.yaml` deploys the backend service successfully.
- [ ] Test Expo app startup and local device connection if distributing on mobile.

## Launch locally
- Start backend: `cd backend && npm run dev`
- Start mobile app: `cd mobile && npm start`
- Or run the root launch script: `./launch.ps1` on Windows or `./launch.sh` on macOS/Linux
