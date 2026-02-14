'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  doc,
  type Firestore,
  type DocumentData,
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '../errors';

export function useDoc<T = DocumentData>(docPath: string) {
  const firestore = useFirestore() as Firestore;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore) return;

    const docRef = doc(firestore, docPath);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
            path: docPath,
            operation: 'get',
        } satisfies SecurityRuleContext);
        
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, docPath]);

  return { data, loading, error };
}
