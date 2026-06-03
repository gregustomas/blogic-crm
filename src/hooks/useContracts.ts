import type { Contract } from "@/types";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useContracts() {
  const [data, setData] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "contracts"),
      (snapshot) => {
        setData(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Contract,
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

export function useContract(id: string) {
  const [data, setData] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "contracts", id),
      (snapshot) => {
        setData(
          snapshot.exists()
            ? ({ id: snapshot.id, ...snapshot.data() } as Contract)
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

export function useContractsByClient(clientId: string) {
  const [data, setData] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "contracts"), where("clientId", "==", clientId)),
      (snapshot) => {
        setData(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Contract,
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
  }, [clientId]);

  return { data, loading, error };
}

export function useContractsByAdvisor(advisorId: string) {
  const [data, setData] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "contracts"),
        where("participantIds", "array-contains", advisorId),
      ),
      (snapshot) => {
        setData(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Contract,
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
  }, [advisorId]);

  return { data, loading, error };
}
