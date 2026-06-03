import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAgeFromPersonalId(personalId: string): number | null {
  // odstraň lomítko a mezery
  const cleaned = personalId.replace(/[\s/]/g, "");

  // musí mít 9 nebo 10 číslic
  if (!/^\d{9,10}$/.test(cleaned)) return null;

  let year = parseInt(cleaned.substring(0, 2));
  let month = parseInt(cleaned.substring(2, 4));

  // ženy +50, od 2004 přetečení +20 (muži) nebo +70 (ženy)
  if (month > 70) month -= 70;
  else if (month > 50) month -= 50;
  else if (month > 20) month -= 20;

  // rok po 2000 nebo před 2000
  year += year + 2000 <= new Date().getFullYear() ? 2000 : 1900;

  const day = parseInt(cleaned.substring(4, 6));
  const birth = new Date(year, month - 1, day);

  // validace že datum skutečně existuje (JS posouvá neplatné dny)
  if (
    birth.getFullYear() !== year ||
    birth.getMonth() !== month - 1 ||
    birth.getDate() !== day
  )
    return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

  return age;
}

export function formatPersonalId(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 6) return digits;
  return `${digits.substring(0, 6)}/${digits.substring(6, 10)}`;
}

export function fullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}
