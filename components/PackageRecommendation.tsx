"use client";
import { determinePackage } from "@/lib/utils";

interface PackageRecommendationProps {
  goal: string;
  budget: string;
  features?: string[];
  pagesCount?: number;
}

export function PackageRecommendation({
  goal,
  budget,
  features,
  pagesCount,
}: PackageRecommendationProps) {
  const packageType = determinePackage(goal, budget, features, pagesCount);

  const packageInfo = {
    Starter: {
      name: "Starter",
      description: "Perfect for small projects and simple requirements",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    Growth: {
      name: "Growth",
      description: "Ideal for growing businesses with moderate complexity",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    Pro: {
      name: "Pro",
      description: "Comprehensive solution for complex, enterprise-level needs",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
  };

  const info = packageInfo[packageType];

  return (
    <div
      className={`p-6 rounded-lg border-2 ${info.color} transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-2xl font-bold">{info.name}</h3>
        <span className="text-sm font-medium opacity-75">Recommended</span>
      </div>
      <p className="text-sm opacity-90">{info.description}</p>
    </div>
  );
}

