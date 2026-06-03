import type { Advisor } from "@/types";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useAdvisors() {
  const [data, setData] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "advisors"),
      (snapshot) => {
        setData(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Advisor,
          ),
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

export function useAdvisor(id: string) {
  const [data, setData] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "advisors", id),
      (snapshot) => {
        setData(
          snapshot.exists()
            ? ({ id: snapshot.id, ...snapshot.data() } as Advisor)
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
