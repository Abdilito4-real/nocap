'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAt,
  endAt,
  type Firestore,
  type DocumentData,
  type Query,
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '../errors';

interface CollectionOptions {
  where?: [string, any, any][];
  orderBy?: [string, 'asc' | 'desc'][];
  limit?: number;
  startAt?: any[];
  endAt?: any[];
}

export function useCollection<T = DocumentData>(
  collectionPath: string,
  options: CollectionOptions = {}
) {
  const firestore = useFirestore() as Firestore;
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore) return;

    let q: Query;
    try {
      const collectionRef = collection(firestore, collectionPath);
      
      const queryConstraints = [];
      if (options.where) {
        options.where.forEach(w => queryConstraints.push(where(w[0], w[1], w[2])));
      }
      if (options.orderBy) {
        options.orderBy.forEach(o => queryConstraints.push(orderBy(o[0], o[1])));
      }
      if (options.limit) {
        queryConstraints.push(limit(options.limit));
      }
      if (options.startAt) {
        queryConstraints.push(startAt(...options.startAt));
      }
      if (options.endAt) {
        queryConstraints.push(endAt(...options.endAt));
      }

      q = query(collectionRef, ...queryConstraints);
    } catch(e: any) {
        setError(e);
        setLoading(false);
        return;
    }


    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as T)
        );
        setData(docs);
        setLoading(false);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: collectionPath,
          operation: 'list',
        } satisfies SecurityRuleContext);

        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, collectionPath, JSON.stringify(options)]);

  return { data, loading, error };
}
