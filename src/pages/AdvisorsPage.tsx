import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import * as advisorService from "@/services/advisors";
import { fullName, getAgeFromPersonalId } from "@/lib/utils";
import type { UserFormData } from "@/lib/schemas";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAdvisors } from "@/hooks/useAdvisors";
import { AdvisorForm } from "@/components/advisors/AdvisorForm";

async function checkDuplicates(
  email: string,
  personalId: string,
  excludeId?: string,
): Promise<boolean> {
  const [emailTaken, personalIdTaken] = await Promise.all([
    advisorService.isEmailTaken(email, excludeId),
    advisorService.isPersonalIdTaken(personalId, excludeId),
  ]);

  if (emailTaken) {
    toast.error("Tento email již existuje");
    return true;
  }
  if (personalIdTaken) {
    toast.error("Toto rodné číslo již existuje");
    return true;
  }
  return false;
}

export default function AdvisorsPage() {
  const { data: advisors } = useAdvisors();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleCreate = async (data: UserFormData) => {
    if (await checkDuplicates(data.email, data.personalId)) return;
    await advisorService.create({
      ...data,
      age: getAgeFromPersonalId(data.personalId) ?? 0,
    });
    toast.success("Poradce úspěšně vytvořen");
  };

  const handleUpdate = async (id: string, data: UserFormData) => {
    if (await checkDuplicates(data.email, data.personalId, id)) return;
    await advisorService.update(id, {
      ...data,
      age: getAgeFromPersonalId(data.personalId) ?? 0,
    });
    toast.success("Poradce úspěšně aktualizován");
  };

  const filteredAdvisors =
    search.length >= 3
      ? advisors?.filter((advisor) => {
          const q = search.toLowerCase();
          return (
            advisor.firstName.toLowerCase().includes(q) ||
            advisor.lastName.toLowerCase().includes(q) ||
            advisor.email.toLowerCase().includes(q) ||
            advisor.phone.toLowerCase().includes(q) ||
            advisor.personalId.toLowerCase().includes(q)
          );
        })
      : advisors;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Poradci</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Počet poradců: {filteredAdvisors?.length ?? 0}
          </p>
        </div>
        <AdvisorForm onSubmit={handleCreate} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Hledat podle jména, emailu nebo telefonu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jméno</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Věk</TableHead>
            <TableHead className="text-right">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAdvisors?.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                Žádní poradci
              </TableCell>
            </TableRow>
          )}
          {filteredAdvisors?.map((advisor) => (
            <TableRow
              key={advisor.id}
              onClick={() => navigate(`/advisors/${advisor.id}`)}
              className="cursor-pointer"
            >
              <TableCell>
                {fullName(advisor.firstName, advisor.lastName)}
              </TableCell>
              <TableCell>{advisor.email}</TableCell>
              <TableCell>{advisor.phone}</TableCell>
              <TableCell>{advisor.age}</TableCell>
              <TableCell
                className="text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex space-x-2 justify-end">
                  {/* detail */}
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/advisors/${advisor.id}`)}
                  >
                    <Eye />
                  </Button>

                  {/* update */}
                  <AdvisorForm
                    onSubmit={(data) => handleUpdate(advisor.id, data)}
                    defaultValues={{ ...advisor }}
                    triggerLabel={<Pencil />}
                    triggerVariant="ghost"
                    triggerSize="icon"
                  />

                  {/* delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" className="text-destructive">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Opravdu chcete smazat tohoto poradce?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tato akce nemůže být vrácena. Tímto bude poradce
                          trvale odstraněn, včetně všech jeho dat.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Zrušit</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => {
                            advisorService.deleteById(advisor.id);
                            toast.success("Poradce úspěšně smazán");
                          }}
                        >
                          Smazat
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
