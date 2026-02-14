'use client';

import React from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

// Initialize Firebase on the client
const { app, auth, firestore } = initializeFirebase();

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider value={{ app, auth, firestore }}>
      {children}
    </FirebaseProvider>
  );
}
