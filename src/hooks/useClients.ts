import type { Client } from "@/types";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useClients() {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "clients"),
      (snapshot) => {
        setData(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Client),
        );
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { data, loading, error };
}

export function useClient(id: string) {
  const [data, setData] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "clients", id),
      (snapshot) => {
        setData(
          snapshot.exists()
            ? ({ id: snapshot.id, ...snapshot.data() } as Client)
            : null,
        );
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [id]);

  return { data, loading, error };
}
