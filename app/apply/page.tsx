"use client";
import { useState } from "react";
import { MultiStepForm } from "@/components/MultiStepForm";
import { SuccessScreen } from "@/components/SuccessScreen";

export default function ApplyPage() {
  const [submittedData, setSubmittedData] = useState<any>(null);

  if (submittedData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <SuccessScreen formData={submittedData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Started
          </h1>
          <p className="text-xl text-gray-600">
            Complete the form below to receive a personalized package
            recommendation.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <MultiStepForm onSuccess={setSubmittedData} />
        </div>
      </div>
    </div>
  );
}

