import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { videoPosts, assignments, jobs, confessions } from '../src/lib/data';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function seed() {
  console.log("Starting database seeding...");

  if (!firebaseConfig.apiKey) {
    console.error("❌ Error: Missing Firebase configuration.");
    console.error("Please ensure NEXT_PUBLIC_FIREBASE_* variables are set in your .env.local file.");
    process.exit(1);
  }

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log("📦 Seeding video posts...");
    for (const post of videoPosts) {
      await addDoc(collection(db, 'videoPosts'), post);
    }

    console.log("📦 Seeding assignments...");
    for (const assignment of assignments) {
      await addDoc(collection(db, 'assignments'), assignment);
    }

    console.log("📦 Seeding jobs...");
    for (const job of jobs) {
      await addDoc(collection(db, 'jobs'), job);
    }

    console.log("📦 Seeding confessions...");
    for (const confession of confessions) {
      await addDoc(collection(db, 'confessions'), confession);
    }

    console.log("✅ Seeding complete! Your Firestore database is now populated.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
