'use client';

import React, { useEffect } from 'react';
import { errorEmitter, FirestorePermissionError } from '@/firebase';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In a development environment, we want to throw the error
      // to make it visible in the Next.js error overlay.
      if (process.env.NODE_ENV === 'development') {
        // We throw it in a timeout to break out of the current render cycle
        // and avoid React's own error boundaries catching it, allowing
        // the Next.js overlay to appear.
        setTimeout(() => {
          throw error;
        }, 0);
      } else {
        // In production, you might want to log this to a service
        // like Sentry, but for now, we'll just log to the console.
        console.error(error.message);
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  // This component does not render anything itself.
  return null;
}
