"use client";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { z } from "zod";

export const step1Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  goal: z.enum(["Website", "App", "Branding", "Other"], {
    required_error: "Please select a goal",
  }),
});

export type Step1Data = z.infer<typeof step1Schema>;

interface FormStep1Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
}

export function FormStep1({ register, errors, watch }: FormStep1Props) {
  const goal = watch("goal");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600">
          Let&apos;s start with some basic details about your project.
        </p>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">
            {errors.name.message as string}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">
            {errors.email.message as string}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="goal"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          What are you looking to build? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          {(["Website", "App", "Branding", "Other"] as const).map((option) => (
            <label
              key={option}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                goal === option
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                value={option}
                {...register("goal")}
                className="sr-only"
              />
              <span className="font-medium text-gray-900">{option}</span>
            </label>
          ))}
        </div>
        {errors.goal && (
          <p className="text-red-600 text-sm mt-1">
            {errors.goal.message as string}
          </p>
        )}
      </div>
    </div>
  );
}

