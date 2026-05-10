import { useEffect } from "react";
import { getLoginUrl } from "@/const";

export default function LoginPage() {
  useEffect(() => {
    // Redirect to OAuth login or show message
    const loginUrl = getLoginUrl();
    if (loginUrl !== "/api/dev-login") {
      window.location.href = loginUrl;
    } else {
      // In production, no dev login
      alert("Login system is not configured. Please contact administrator.");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p>Redirecting to login...</p>
      </div>
    </div>
  );
}
