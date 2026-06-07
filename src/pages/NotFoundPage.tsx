import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-7xl font-bold text-muted-foreground/30">404</p>
      <h1 className="text-2xl font-semibold">Stránka nenalezena</h1>
      <p className="text-sm text-muted-foreground">
        Stránka, kterou hledáte, neexistuje.
      </p>
      <Button onClick={() => navigate("/")}>Zpět na přehled</Button>
    </div>
  );
}
