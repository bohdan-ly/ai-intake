"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Search, Download, ChevronDown } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { OopsPage } from "./OopsPage";

interface AdminDashboardProps {
  adminToken: string;
}

export function AdminDashboard({ adminToken }: AdminDashboardProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"New" | "Contacted" | "All">("All");
  const [error, setError] = useState<Error | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const submissions = useQuery(
    api.submissions.list,
    adminToken
      ? {
          search: debouncedSearch || undefined,
          status: statusFilter !== "All" ? statusFilter : undefined,
          token: adminToken,
        }
      : "skip"
  );

  // Handle errors from the query
  useEffect(() => {
    if (submissions === null) {
      // Query returned null, which might indicate an error
      setError(new Error("Unauthorized"));
    }
  }, [submissions]);

  const updateStatus = useMutation(api.submissions.updateStatus);

  const handleStatusChange = async (
    id: Id<"submissions">,
    newStatus: "New" | "Contacted"
  ) => {
    try {
      await updateStatus({ id, status: newStatus, token: adminToken });
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleExportCSV = () => {
    if (!submissions || submissions.length === 0) {
      alert("No submissions to export");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Goal",
      "Budget",
      "Package",
      "Status",
      "Created Date",
    ];
    const rows = submissions.map((sub) => [
      sub.name,
      sub.email,
      sub.goal,
      sub.budget,
      sub.recommendedPackage,
      sub.status,
      format(new Date(sub.createdAt), "yyyy-MM-dd HH:mm:ss"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatBudget = (budget: string) => {
    const budgetMap: Record<string, string> = {
      "<500": "< $500",
      "500-2000": "$500 - $2,000",
      "2000-5000": "$2,000 - $5,000",
      "5000+": "$5,000+",
    };
    return budgetMap[budget] || budget;
  };

  // Show Oops page if there's an error
  if (error) {
    return (
      <OopsPage
        message="You are not authorized to access this page. Please check your credentials."
        onRetry={() => {
          setError(null);
          window.location.reload();
        }}
      />
    );
  }

  if (submissions === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading submissions...</div>
      </div>
    );
  }

  if (submissions === null) {
    return (
      <OopsPage
        message="You are not authorized to access this page. Please check your credentials."
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
          <p className="text-gray-600 mt-1">
            {submissions.length} total submission{submissions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "New" | "Contacted" | "All")
            }
            className="w-full sm:w-48 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Goal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No submissions found
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {submission.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {submission.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {submission.goal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatBudget(submission.budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          submission.recommendedPackage === "Pro"
                            ? "bg-purple-100 text-purple-800"
                            : submission.recommendedPackage === "Growth"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {submission.recommendedPackage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={submission.status}
                        onChange={(e) =>
                          handleStatusChange(
                            submission._id,
                            e.target.value as "New" | "Contacted"
                          )
                        }
                        className={`text-sm font-medium px-3 py-1 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          submission.status === "New"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(submission.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

