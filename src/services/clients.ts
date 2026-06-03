import { db } from "@/lib/firebase";
import type { Client } from "@/types";
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

const clientsRef = collection(db, "clients");

export async function getAll(): Promise<Client[]> {
  const snapshot = await getDocs(clientsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Client);
}

export async function getById(id: string): Promise<Client | null> {
  const snapshot = await getDoc(doc(clientsRef, id));
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Client)
    : null;
}

export async function create(data: Omit<Client, "id">): Promise<string> {
  const docRef = await addDoc(clientsRef, data);
  return docRef.id;
}

export async function update(id: string, data: Partial<Client>): Promise<void> {
  await updateDoc(doc(clientsRef, id), data);
}

export async function deleteById(id: string): Promise<void> {
  await deleteDoc(doc(clientsRef, id));
}

export async function isEmailTaken(
  email: string,
  excludeId?: string,
): Promise<boolean> {
  const snapshot = await getDocs(
    query(clientsRef, where("email", "==", email)),
  );
  return snapshot.docs.some((doc) => doc.id !== excludeId);
}

export async function isPersonalIdTaken(
  personalId: string,
  excludeId?: string,
): Promise<boolean> {
  const snapshot = await getDocs(
    query(clientsRef, where("personalId", "==", personalId)),
  );
  return snapshot.docs.some((doc) => doc.id !== excludeId);
}
