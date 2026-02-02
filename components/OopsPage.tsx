"use client";
import { AlertCircle, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface OopsPageProps {
  message?: string;
  onRetry?: () => void;
}

export function OopsPage({ message, onRetry }: OopsPageProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oops!</h1>
        <p className="text-gray-600 mb-6">
          {message || "Something went wrong. Please try again."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => router.push("/admin/login")}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

