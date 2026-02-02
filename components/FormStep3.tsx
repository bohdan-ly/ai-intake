"use client";
import { UseFormWatch } from "react-hook-form";
import { PackageRecommendation } from "./PackageRecommendation";
import { Loader2 } from "lucide-react";

interface FormStep3Props {
  watch: UseFormWatch<any>;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

export function FormStep3({ watch, onSubmit, isLoading, error }: FormStep3Props) {
  const formData = watch();

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">
          Please review your information before submitting.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
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

      <PackageRecommendation
        goal={formData.goal}
        budget={formData.budget}
        features={formData.features}
        pagesCount={formData.pagesCount}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p className="font-medium">Error submitting form</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </button>
    </div>
  );
}

