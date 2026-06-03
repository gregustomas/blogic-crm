import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useClients } from "@/hooks/useClients";
import * as clientService from "@/services/clients";
import { useForm } from "react-hook-form";
import { formatPersonalId, getAgeFromPersonalId } from "@/lib/utils";
import { clientSchema, type ClientFormData } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export default function ClientsPage() {
  const [open, setOpen] = useState(false);
  const { data: clients } = useClients();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = async (data: ClientFormData) => {
    const age = getAgeFromPersonalId(data.personalId);
    await clientService.create({ ...data, age: age ?? 0 });
    reset();
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Klienti</h1>
          <p className="text-sm text-muted-foreground mt-1">Správa klientů a jejich smluv</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Přidat klienta</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="mb-4">
              <DialogTitle>Nový klient</DialogTitle>
              <DialogDescription>
                Zadejte informace o novém klientovi.
              </DialogDescription>
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
      </div>

      <Table>
        <TableCaption>Klienti</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Jméno</TableHead>
            <TableHead>Příjmení</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Rodné číslo</TableHead>
            <TableHead>Věk</TableHead>
            <TableHead>Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.firstName}</TableCell>
              <TableCell>{client.lastName}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.personalId}</TableCell>
              <TableCell>{client.age}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Upravit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
