"use client";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { z } from "zod";

export const step2Schema = z.object({
  pagesCount: z.number().min(1).max(20).optional(),
  features: z.array(z.string()).optional(),
  platform: z.enum(["iOS", "Android", "Web"]).optional(),
  authNeeded: z.boolean().optional(),
  budget: z.enum(["<500", "500-2000", "2000-5000", "5000+"], {
    required_error: "Please select a budget range",
  }),
});

export type Step2Data = z.infer<typeof step2Schema>;

interface FormStep2Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  setValue: (name: string, value: any) => void;
}

export function FormStep2({ register, errors, watch, setValue }: FormStep2Props) {
  const goal = watch("goal");
  const budget = watch("budget");
  const pagesCount = watch("pagesCount");
  const features = watch("features") || [];
  const platform = watch("platform");
  const authNeeded = watch("authNeeded");

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = features || [];
    if (currentFeatures.includes(feature)) {
      setValue(
        "features",
        currentFeatures.filter((f: string) => f !== feature)
      );
    } else {
      setValue("features", [...currentFeatures, feature]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Details</h2>
        <p className="text-gray-600">
          Tell us more about your specific requirements.
        </p>
      </div>

      {goal === "Website" && (
        <>
          <div>
            <label
              htmlFor="pagesCount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of Pages
            </label>
            <div className="flex items-center gap-4">
              <input
                id="pagesCount"
                type="range"
                min="1"
                max="20"
                {...register("pagesCount", { valueAsNumber: true })}
                className="flex-1"
              />
              <span className="text-lg font-semibold text-gray-900 min-w-[3rem] text-center">
                {pagesCount || 1}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features Needed
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["blog", "payments", "auth", "dashboard"].map((feature) => (
                <label
                  key={feature}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    features.includes(feature)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="sr-only"
                  />
                  <span className="font-medium text-gray-900 capitalize">
                    {feature}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {goal === "App" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(["iOS", "Android", "Web"] as const).map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    platform === option
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={option}
                    {...register("platform")}
                    className="sr-only"
                  />
                  <span className="font-medium text-gray-900">{option}</span>
                </label>
              ))}
            </div>
            {errors.platform && (
              <p className="text-red-600 text-sm mt-1">
                {errors.platform.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authentication Needed
            </label>
            <div className="flex gap-4">
              <label
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors flex-1 ${
                  authNeeded === true
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  {...register("authNeeded", { valueAsNumber: false })}
                  value="true"
                  checked={authNeeded === true}
                  onChange={() => setValue("authNeeded", true)}
                  className="sr-only"
                />
                <span className="font-medium text-gray-900">Yes</span>
              </label>
              <label
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors flex-1 ${
                  authNeeded === false
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  {...register("authNeeded", { valueAsNumber: false })}
                  value="false"
                  checked={authNeeded === false}
                  onChange={() => setValue("authNeeded", false)}
                  className="sr-only"
                />
                <span className="font-medium text-gray-900">No</span>
              </label>
            </div>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Range <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "<500", label: "< $500" },
            { value: "500-2000", label: "$500 - $2,000" },
            { value: "2000-5000", label: "$2,000 - $5,000" },
            { value: "5000+", label: "$5,000+" },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                budget === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                value={option.value}
                {...register("budget")}
                className="sr-only"
              />
              <span className="font-medium text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.budget && (
          <p className="text-red-600 text-sm mt-1">
            {errors.budget.message as string}
          </p>
        )}
      </div>
    </div>
  );
}

