import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth({ redirectIfUnauth = true } = {}) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/check", {
          credentials: "include",
        });
        const data = await res.json();

        setIsAuthenticated(data.isAuthenticated);
        if (!data.isAuthenticated && redirectIfUnauth) {
          navigate("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (redirectIfUnauth) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, redirectIfUnauth]);

  return { isAuthenticated, loading };
}
