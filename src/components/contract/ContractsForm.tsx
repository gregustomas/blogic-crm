import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractSchema, type ContractFormData } from "@/lib/schemas";
import { useState, useEffect, useRef } from "react";
import { useClients } from "@/hooks/useClients";
import { useAdvisors } from "@/hooks/useAdvisors";
import { fullName } from "@/lib/utils";
import { ComboboxSelect } from "../ui/combobox";
import { ParticipantsSelect } from "./ParticipantsSelect";

interface ContractsFormLabels {
  trigger: React.ReactNode;
  dialogTitle: string;
  description: string;
}

interface ContractsFormProps {
  onSubmit: (data: ContractFormData) => Promise<void>;
  defaultValues?: ContractFormData;
  labels: ContractsFormLabels;
  triggerVariant?: "default" | "outline" | "ghost";
  triggerSize?: "default" | "sm" | "icon";
}

export function ContractsForm({
  onSubmit,
  defaultValues,
  labels,
  triggerVariant = "outline",
  triggerSize = "default",
}: ContractsFormProps) {
  const [open, setOpen] = useState(false);

  const { data: clients } = useClients();
  const { data: advisors } = useAdvisors();

  const clientOptions = (clients ?? []).map((c) => ({
    value: c.id,
    label: fullName(c.firstName, c.lastName),
  }));

  const advisorOptions = (advisors ?? []).map((a) => ({
    value: a.id,
    label: fullName(a.firstName, a.lastName),
  }));

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: defaultValues ?? {
      registrationNumber: "",
      institution: "",
      clientId: "",
      managerId: "",
      participantIds: [],
      signedAt: "",
      validFrom: "",
      validUntil: "",
    },
  });

  const prevManagerRef = useRef("");

  useEffect(() => {
    if (open) {
      prevManagerRef.current = "";
      reset(
        defaultValues ?? {
          registrationNumber: "",
          institution: "",
          clientId: "",
          managerId: "",
          participantIds: [],
          signedAt: "",
          validFrom: "",
          validUntil: "",
        },
      );
    }
  }, [open]);

  const managerId = watch("managerId");
  const participantIds = watch("participantIds");

  useEffect(() => {
    const prev = prevManagerRef.current;
    prevManagerRef.current = managerId;

    const current = getValues("participantIds");
    let updated = current.filter((id) => id !== prev);
    if (managerId && !updated.includes(managerId)) {
      updated = [...updated, managerId];
    }
    setValue("participantIds", updated);
  }, [managerId]);

  const handleFormSubmit = async (data: ContractFormData) => {
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
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle>{labels.dialogTitle}</DialogTitle>
            <DialogDescription>{labels.description}</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <div className="flex gap-2">
              <Field>
                <Label htmlFor="registrationNumber">Číslo smlouvy</Label>
                <Input
                  id="registrationNumber"
                  {...register("registrationNumber")}
                />
                {errors.registrationNumber && (
                  <p className="text-sm text-destructive">
                    {errors.registrationNumber.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label htmlFor="institution">Instituce</Label>
                <Input id="institution" {...register("institution")} />
                {errors.institution && (
                  <p className="text-sm text-destructive">
                    {errors.institution.message}
                  </p>
                )}
              </Field>
            </div>

            <Field>
              <Label>Klient</Label>
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <ComboboxSelect
                    options={clientOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Vyberte klienta..."
                    searchPlaceholder="Hledat klienta..."
                    emptyMessage="Žádný klient nenalezen"
                  />
                )}
              />
              {errors.clientId && (
                <p className="text-sm text-destructive">
                  {errors.clientId.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Správce smlouvy</Label>
              <Controller
                name="managerId"
                control={control}
                render={({ field }) => (
                  <ComboboxSelect
                    options={advisorOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Vyberte správce..."
                    searchPlaceholder="Hledat poradce..."
                    emptyMessage="Žádný poradce nenalezen"
                  />
                )}
              />
              {errors.managerId && (
                <p className="text-sm text-destructive">
                  {errors.managerId.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Účastníci</Label>
              <Controller
                name="participantIds"
                control={control}
                render={({ field }) => (
                  <ParticipantsSelect
                    options={advisorOptions}
                    value={field.value}
                    onChange={field.onChange}
                    managerId={managerId}
                  />
                )}
              />
              {participantIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {participantIds.map((id) => {
                    const name = advisorOptions.find(
                      (a) => a.value === id,
                    )?.label;
                    const isManager = id === managerId;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                      >
                        {name}
                        {isManager && (
                          <span className="ml-1 text-muted-foreground">
                            · správce
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
              {errors.participantIds && (
                <p className="text-sm text-destructive">
                  {errors.participantIds.message}
                </p>
              )}
            </Field>

            <div className="flex flex-col sm:flex-row gap-2">
              <Field>
                <Label htmlFor="signedAt">Datum podpisu</Label>
                <Input id="signedAt" type="date" {...register("signedAt")} />
                {errors.signedAt && (
                  <p className="text-sm text-destructive">
                    {errors.signedAt.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label htmlFor="validFrom">Platnost od</Label>
                <Input id="validFrom" type="date" {...register("validFrom")} />
                {errors.validFrom && (
                  <p className="text-sm text-destructive">
                    {errors.validFrom.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label htmlFor="validUntil">Platnost do</Label>
                <Input
                  id="validUntil"
                  type="date"
                  {...register("validUntil")}
                />
                {errors.validUntil && (
                  <p className="text-sm text-destructive">
                    {errors.validUntil.message}
                  </p>
                )}
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Zrušit
              </Button>
            </DialogClose>
            <Button type="submit">Uložit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
