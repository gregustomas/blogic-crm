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
import { userSchema, type UserFormData } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PHONE_PREFIXES } from "@/lib/utils";

function parsePhone(phone: string): { prefix: string; local: string } {
  for (const p of PHONE_PREFIXES) {
    if (phone.startsWith(p.value)) {
      return { prefix: p.value, local: phone.slice(p.value.length).trim() };
    }
  }
  return { prefix: "+420", local: "" };
}

function formatLocalNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ");
}

interface UserFormLabels {
  trigger: React.ReactNode;
  dialogTitle: string;
  description: string;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  defaultValues?: UserFormData;
  labels: UserFormLabels;
  triggerVariant?: "default" | "outline" | "ghost";
  triggerSize?: "default" | "sm" | "icon";
}

export function UserForm({
  onSubmit,
  defaultValues,
  labels,
  triggerVariant = "default",
  triggerSize = "default",
}: UserFormProps) {
  const [open, setOpen] = useState(false);
  const [prefix, setPrefix] = useState("+420");
  const [localNumber, setLocalNumber] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      const parsed = parsePhone(defaultValues?.phone ?? "");
      setPrefix(parsed.prefix);
      setLocalNumber(parsed.local);
    }
  }, [open]);

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size={triggerSize}>
          {labels.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle>{labels.dialogTitle}</DialogTitle>
            <DialogDescription>{labels.description}</DialogDescription>
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
              <input type="hidden" {...register("phone")} />
              <div className="flex gap-2">
                <Select
                  value={prefix}
                  onValueChange={(val) => {
                    setPrefix(val);
                    setValue("phone", `${val} ${localNumber}`.trim());
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PHONE_PREFIXES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="123 456 789"
                  value={localNumber}
                  onChange={(e) => {
                    const formatted = formatLocalNumber(e.target.value);
                    setLocalNumber(formatted);
                    setValue("phone", `${prefix} ${formatted}`.trim());
                  }}
                />
              </div>
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
