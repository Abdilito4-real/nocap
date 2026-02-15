# NoCap - Student-Centric Social and Utility App

NoCap is a Next.js application designed for students, featuring video feeds, job listings, assignments tracking, and more.

## Progressive Web App (PWA)

This application is fully PWA-ready. You can install it on your mobile device or desktop for a native-like experience.

- **Offline Support:** Basic offline support is implemented via Service Workers.
- **Installable:** Includes a custom installation banner and manifest configuration.

## Firebase Integration

This project uses Firebase for Authentication and Firestore. To get it working, you need to set up a Firebase project and add your configuration.

### 1. Local Setup

Create a `.env.local` file in the root directory and copy the values from your Firebase Console (Project Settings > General > Your apps):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Vercel Deployment

When deploying to Vercel, make sure to add the same environment variables in the Vercel Dashboard:

1. Go to your project on **Vercel**.
2. Navigate to **Settings > Environment Variables**.
3. Add each of the variables listed above with their respective values.
4. Redeploy your application for the changes to take effect.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
