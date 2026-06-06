import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return unsubscribe;
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <LoginForm className="w-full max-w-sm" />
    </div>
  );
}
