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
