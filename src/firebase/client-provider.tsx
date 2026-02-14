'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // This ensures that Firebase is initialized only on the client side.
    const firebaseInstances = initializeFirebase();
    if (firebaseInstances) {
      setInstances(firebaseInstances);
    }
  }, []);

  // We always render the provider. It will pass down `null` for Firebase
  // services if initialization hasn't happened or failed. The custom
  // hooks like `useAuth` are designed to handle this gracefully.
  return (
    <FirebaseProvider value={instances || { app: null, auth: null, firestore: null }}>
      {children}
    </FirebaseProvider>
  );
}
