import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { formatPersonalId } from "@/lib/utils";
import { clientSchema, type ClientFormData } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => Promise<void>;
  defaultValues?: ClientFormData;
  triggerLabel?: React.ReactNode;
  triggerVariant?: "default" | "outline" | "ghost";
  triggerSize?: "default" | "sm" | "icon";
}

export function ClientForm({
  onSubmit,
  defaultValues,
  triggerLabel = "Přidat klienta",
  triggerVariant = "outline",
  triggerSize = "default",
}: ClientFormProps) {
  const dialogTitle = defaultValues ? "Upravit klienta" : "Nový klient";
  const dialogDescription = defaultValues
    ? "Upravte informace o klientovi."
    : "Zadejte informace o novém klientovi.";
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open]);

  const handleFormSubmit = async (data: ClientFormData) => {
    await onSubmit(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size={triggerSize}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <div className="flex space-x-2">
              <Field>
                <Label htmlFor="firstName">Jméno</Label>
                <Input
                  id="firstName"
                  placeholder="Jan"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label htmlFor="lastName">Příjmení</Label>
                <Input
                  id="lastName"
                  placeholder="Novák"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </Field>
            </div>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jan.novak@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </Field>
            <Field>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+420 123 456 789"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </Field>
            <Field>
              <Label htmlFor="personalId">Rodné číslo</Label>
              <Input
                id="personalId"
                placeholder="850712/1234"
                maxLength={11}
                {...register("personalId")}
                onChange={(e) => {
                  formatPersonalId(e.target.value);
                  setValue("personalId", formatPersonalId(e.target.value));
                }}
              />
              {errors.personalId && (
                <p className="text-sm text-destructive">
                  {errors.personalId.message}
                </p>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Zavřít</Button>
            </DialogClose>
            <Button type="submit">Uložit změny</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
