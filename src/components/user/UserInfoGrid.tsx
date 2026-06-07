import { Mail, Phone, IdCard, CalendarDays, type LucideIcon } from "lucide-react";
import { getAgeFromPersonalId } from "@/lib/utils";

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium break-all">{value}</p>
      </div>
    </div>
  );
}

interface Props {
  email: string;
  phone: string;
  personalId: string;
}

export function UserInfoGrid({ email, phone, personalId }: Props) {
  const age = getAgeFromPersonalId(personalId);
  return (
    <div className="lg:col-span-2 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow icon={Mail} label="Email" value={email} />
        <InfoRow icon={Phone} label="Telefon" value={phone} />
        <InfoRow icon={IdCard} label="Rodné číslo" value={personalId} />
        <InfoRow icon={CalendarDays} label="Věk" value={age !== null ? `${age} let` : "—"} />
      </div>
    </div>
  );
}
