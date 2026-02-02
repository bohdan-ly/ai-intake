"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormStep1, step1Schema, type Step1Data } from "./FormStep1";
import { FormStep2, step2Schema, type Step2Data } from "./FormStep2";
import { FormStep3 } from "./FormStep3";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const formSchema = step1Schema.merge(step2Schema);

type FormData = z.infer<typeof formSchema>;

interface MultiStepFormProps {
  onSuccess: (data: FormData) => void;
}

export function MultiStepForm({ onSuccess }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubmission = useMutation(api.submissions.create);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 1) {
      return await trigger(["name", "email", "goal"]);
    }
    if (step === 2) {
      return await trigger(["budget"]);
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setError(null);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare submission data
      const submissionData: any = {
        name: data.name,
        email: data.email,
        goal: data.goal,
        budget: data.budget,
      };

      // Add conditional fields
      if (data.goal === "Website") {
        if (data.pagesCount) submissionData.pagesCount = data.pagesCount;
        if (data.features && data.features.length > 0) {
          submissionData.features = data.features;
        }
      }

      if (data.goal === "App") {
        if (data.platform) submissionData.platform = data.platform;
        if (data.authNeeded !== undefined) {
          submissionData.authNeeded = data.authNeeded;
        }
      }

      await createSubmission(submissionData);
      onSuccess(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formData = watch();
  const isStep1Valid =
    formData.name && formData.email && formData.goal && !errors.name && !errors.email && !errors.goal;
  const isStep2Valid = formData.budget && !errors.budget;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full ${
                step <= currentStep ? "bg-blue-600" : "bg-gray-200"
              } ${step < currentStep ? "mr-2" : step > currentStep ? "ml-2" : ""}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span className={currentStep >= 1 ? "font-semibold text-blue-600" : ""}>
            Basic Info
          </span>
          <span className={currentStep >= 2 ? "font-semibold text-blue-600" : ""}>
            Details
          </span>
          <span className={currentStep >= 3 ? "font-semibold text-blue-600" : ""}>
            Review
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <FormStep1 register={register} errors={errors} watch={watch} />
        )}

        {currentStep === 2 && (
          <FormStep2
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        )}

        {currentStep === 3 && (
          <FormStep3
            watch={watch}
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isLoading}
            error={error}
          />
        )}

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? !isStep1Valid
                  : !isStep2Valid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

