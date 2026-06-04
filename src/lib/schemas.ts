import { z } from "zod";
import { getAgeFromPersonalId } from "./utils";

export const userSchema = z
  .object({
    firstName: z.string().min(1, "Jméno je povinné"),
    lastName: z.string().min(1, "Příjmení je povinné"),
    email: z.string().email("Neplatný email"),
    phone: z
      .string()
      .regex(
        /^\+\d{1,3}\s?\d{3}\s?\d{3}\s?\d{3,4}$/,
        "Neplatné telefonní číslo (např. +420 123 456 789)",
      ),
    personalId: z.string().regex(/^\d{6}\/\d{3,4}$/, "Neplatné rodné číslo"),
  })
  .refine(
    (data) => {
      const age = getAgeFromPersonalId(data.personalId);
      return age !== null && age >= 18 && age <= 100;
    },
    { message: "Klient musí mít 18–100 let", path: ["personalId"] },
  );

export type UserFormData = z.infer<typeof userSchema>;

export const contractSchema = z.object({
  registrationNumber: z.string().min(1, "Evidenční číslo je povinné"),
  institution: z.string().min(1, "Instituce je povinná"),
  clientId: z.string().min(1, "Klient je povinný"),
  managerId: z.string().min(1, "Správce je povinný"),
  participantIds: z
    .array(z.string())
    .min(1, "Alespoň jeden účastník je povinný"),
  signedAt: z.string().min(1, "Datum podpisu je povinné"),
  validFrom: z.string().min(1, "Platnost od je povinná"),
  validUntil: z.string().optional(),
});

export type ContractFormData = z.infer<typeof contractSchema>;
