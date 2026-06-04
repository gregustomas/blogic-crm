import { db } from "@/lib/firebase";
import type { Advisor } from "@/types";
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

const advisorsRef = collection(db, "advisors");

export async function getAll(): Promise<Advisor[]> {
  const snapshot = await getDocs(advisorsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Advisor);
}

export async function getById(id: string): Promise<Advisor | null> {
  const snapshot = await getDoc(doc(advisorsRef, id));
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Advisor)
    : null;
}

export async function create(data: Omit<Advisor, "id">): Promise<string> {
  const docRef = await addDoc(advisorsRef, data);
  return docRef.id;
}

export async function update(
  id: string,
  data: Partial<Advisor>,
): Promise<void> {
  await updateDoc(doc(advisorsRef, id), data);
}

export async function deleteById(id: string): Promise<void> {
  await deleteDoc(doc(advisorsRef, id));
}

export async function isEmailTaken(
  email: string,
  excludeId?: string,
): Promise<boolean> {
  const snapshot = await getDocs(
    query(advisorsRef, where("email", "==", email)),
  );
  return snapshot.docs.some((doc) => doc.id !== excludeId);
}

export async function isPersonalIdTaken(
  personalId: string,
  excludeId?: string,
): Promise<boolean> {
  const snapshot = await getDocs(
    query(advisorsRef, where("personalId", "==", personalId)),
  );
  return snapshot.docs.some((doc) => doc.id !== excludeId);
}
