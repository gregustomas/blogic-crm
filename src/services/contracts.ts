import { db } from "@/lib/firebase";
import type { Contract } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const contractsRef = collection(db, "contracts");

export async function getAll(): Promise<Contract[]> {
  const snapshot = await getDocs(contractsRef);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Contract,
  );
}

export async function getById(id: string): Promise<Contract | null> {
  const snapshot = await getDoc(doc(contractsRef, id));
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Contract)
    : null;
}

export async function create(data: Omit<Contract, "id">): Promise<string> {
  const docRef = await addDoc(contractsRef, data);
  return docRef.id;
}

export async function update(
  id: string,
  data: Partial<Contract>,
): Promise<void> {
  await updateDoc(doc(contractsRef, id), data);
}

export async function deleteById(id: string): Promise<void> {
  await deleteDoc(doc(contractsRef, id));
}

export async function getByClientId(clientId: string): Promise<Contract[]> {
  const q = query(contractsRef, where("clientId", "==", clientId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Contract,
  );
}

export async function getByAdvisorId(advisorId: string): Promise<Contract[]> {
  const q = query(
    contractsRef,
    where("participantIds", "array-contains", advisorId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Contract,
  );
}
