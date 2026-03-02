'use client';

import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

export function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} | null {
  // Prevent initialization if the API key is missing.
  if (!firebaseConfig.apiKey) {
    if (process.env.NODE_ENV === 'development') {
      const missingKeys = Object.entries(firebaseConfig)
        .filter(([_, value]) => !value)
        .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/[A-Z]/g, letter => `_${letter.toUpperCase()}`).toUpperCase()}`);

      console.warn(
        "Firebase configuration is incomplete. Missing environment variables:",
        missingKeys.join(", "),
        "\nTo fix this, please add these keys to your .env.local file or Vercel dashboard (Settings > Environment Variables)."
      );
    } else {
      console.warn(
        "Firebase configuration not found. The app will run without Firebase features (like Auth/Firestore).\n" +
        "Please ensure all NEXT_PUBLIC_FIREBASE_* environment variables are set in your Vercel project settings."
      );
    }
    return null;
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';