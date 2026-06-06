import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { login } from "@/lib/firebase";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Nesprávný email nebo heslo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="rounded-xl border bg-card p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Přihlásit se do Blogic CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Zadejte email a heslo pro přihlášení.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="jan@blogic.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Heslo</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            {error && <FieldError>{error}</FieldError>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Přihlašování..." : "Přihlásit se"}
            </Button>
          </FieldGroup>
        </form>
      </div>
      <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground space-y-0.5">
        <p><span className="font-medium">Email:</span> admin@blogic.cz</p>
        <p><span className="font-medium">Heslo:</span> blogic2026</p>
      </div>
    </div>
  );
}
