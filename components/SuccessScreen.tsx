"use client";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Plus } from "lucide-react";
import { PackageRecommendation } from "./PackageRecommendation";

interface SuccessScreenProps {
  formData: any;
}

export function SuccessScreen({ formData }: SuccessScreenProps) {
  const formatBudget = (budget: string) => {
    const budgetMap: Record<string, string> = {
      "<500": "< $500",
      "500-2000": "$500 - $2,000",
      "2000-5000": "$2,000 - $5,000",
      "5000+": "$5,000+",
    };
    return budgetMap[budget] || budget;
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Application Submitted Successfully!
        </h2>
        <p className="text-gray-600">
          Thank you for your submission. We&apos;ll review your information and
          get back to you soon.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
          <p className="text-lg text-gray-900">{formData.name}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
          <p className="text-lg text-gray-900">{formData.email}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Goal</h3>
          <p className="text-lg text-gray-900">{formData.goal}</p>
        </div>

        {formData.goal === "Website" && (
          <>
            {formData.pagesCount && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Number of Pages
                </h3>
                <p className="text-lg text-gray-900">{formData.pagesCount}</p>
              </div>
            )}
            {formData.features && formData.features.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Features
                </h3>
                <p className="text-lg text-gray-900">
                  {formData.features.join(", ")}
                </p>
              </div>
            )}
          </>
        )}

        {formData.goal === "App" && (
          <>
            {formData.platform && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Platform
                </h3>
                <p className="text-lg text-gray-900">{formData.platform}</p>
              </div>
            )}
            {formData.authNeeded !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Authentication Needed
                </h3>
                <p className="text-lg text-gray-900">
                  {formData.authNeeded ? "Yes" : "No"}
                </p>
              </div>
            )}
          </>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Budget</h3>
          <p className="text-lg text-gray-900">{formatBudget(formData.budget)}</p>
        </div>
      </div>

      <div className="mb-8">
        <PackageRecommendation
          goal={formData.goal}
          budget={formData.budget}
          features={formData.features}
          pagesCount={formData.pagesCount}
          context="success"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
        <Link
          href="/apply"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Start New Submission
        </Link>
      </div>
    </div>
  );
}

