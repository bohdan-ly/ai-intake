"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormStep1, step1Schema, type Step1Data } from "./FormStep1";
import { FormStep2, step2Schema, type Step2Data } from "./FormStep2";
import { FormStep3 } from "./FormStep3";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X } from "lucide-react";
import { determinePackage } from "@/lib/utils";
import {
  trackApplyStarted,
  trackApplyStepViewed,
  trackApplyStepCompleted,
  trackApplyValidationError,
  trackApplySubmittedSuccess,
  trackApplySubmittedError,
} from "@/lib/analytics";

const formSchema = step1Schema.merge(step2Schema);

type FormData = z.infer<typeof formSchema>;

const DRAFT_STORAGE_KEY = "intake-form-draft";

interface MultiStepFormProps {
  onSuccess: (data: FormData) => void;
}

export function MultiStepForm({ onSuccess }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  const createSubmission = useMutation(api.submissions.create);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  // Analytics: apply started (once when form is shown)
  useEffect(() => {
    trackApplyStarted();
  }, []);

  // Analytics: step viewed (once per step view)
  useEffect(() => {
    trackApplyStepViewed(currentStep as 1 | 2 | 3);
  }, [currentStep]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        const { _currentStep, ...formDataOnly } = draftData;
        reset(formDataOnly);
        setHasDraft(true);
        // Restore current step if available
        if (_currentStep) {
          setCurrentStep(_currentStep);
        }
      } catch (err) {
        console.error("Failed to load draft:", err);
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    }
  }, [reset]);

  // Save draft to localStorage whenever form data changes
  const formData = watch();
  useEffect(() => {
    const hasFormData = formData.name || formData.email || formData.goal || formData.budget;
    if (hasFormData) {
      const draftToSave = {
        ...formData,
        _currentStep: currentStep,
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftToSave));
      setHasDraft(true);
    }
  }, [formData, currentStep]);

  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    reset();
    setCurrentStep(1);
    setHasDraft(false);
    setError(null);
  };

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
      if (currentStep === 1 || currentStep === 2) {
        trackApplyStepCompleted(currentStep as 1 | 2);
      }
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setError(null);
    } else {
      const fieldNames = Object.keys(errors);
      if (fieldNames.length > 0 && (currentStep === 1 || currentStep === 2)) {
        trackApplyValidationError(currentStep as 1 | 2, fieldNames);
      }
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
      const packageType = determinePackage(
        data.goal,
        data.budget,
        data.features,
        data.pagesCount
      );
      trackApplySubmittedSuccess(packageType);
      // Clear draft on successful submission
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasDraft(false);
      onSuccess(data);
    } catch (err) {
      const errorType =
        err instanceof Error ? err.name : "unknown";
      trackApplySubmittedError(errorType);
      setError(
        err instanceof Error ? err.message : "Failed to submit. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const isStep1Valid =
    formData.name && formData.email && formData.goal && !errors.name && !errors.email && !errors.goal;
  const isStep2Valid = formData.budget && !errors.budget;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Draft Banner */}
      {hasDraft && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-900">
              Resume draft
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearDraft}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-md transition-colors"
          >
            Start over
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

