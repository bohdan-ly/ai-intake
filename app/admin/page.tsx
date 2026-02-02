"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function AdminPage() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for admin token in localStorage
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setAdminToken(token);
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!adminToken) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <AdminDashboard adminToken={adminToken} />
        </div>
      </div>
    </ErrorBoundary>
  );
}

